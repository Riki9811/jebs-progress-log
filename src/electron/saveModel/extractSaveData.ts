import path from 'path'
import { parseSfs, type SfsBlock, type SfsValue } from '../parser/sfsParser.js'
import { parseScienceId } from '../parser/scienceIdParser.js'
import { ok, err } from '../result.js'
import { RECOVERY_SITUATIONS } from '../reference/situations.js'
import { DEPLOYED_EXPERIMENT_NAMES } from '../reference/experiments.js'

export type ExtractFailure =
	| { type: 'PARSE'; line: number; reason: string }
	| { type: 'NO_GAME_BLOCK' }

const RECOVERY_SET = new Set<string>(RECOVERY_SITUATIONS)
const DEPLOYED_SET = new Set<string>(DEPLOYED_EXPERIMENT_NAMES)

export function extractSaveData(input: string, filePath: string): Result<SaveData, ExtractFailure> {
	const parsed = parseSfs(input)
	if (!parsed.ok) {
		return err({ type: 'PARSE', line: parsed.error.line, reason: parsed.error.reason })
	}

	const game = parsed.value.GAME
	if (!isBlock(game)) {
		return err({ type: 'NO_GAME_BLOCK' })
	}

	const summary = extractSummary(game, filePath)
	const scenarios = asArray(game.SCENARIO).filter(isBlock)
	const rd = scenarios.find((s) => stringField(s.name) === 'ResearchAndDevelopment')

	const scienceRecords: ScienceRecord[] = []
	let totalScience = numberField(rd?.sci, 0)

	if (rd) {
		const science = asArray(rd.Science).filter(isBlock)
		for (const recordBlock of science) {
			const record = extractScienceRecord(recordBlock)
			if (record) scienceRecords.push(record)
		}
	}

	const aggregations = buildAggregations(scienceRecords)
	if (totalScience === 0) totalScience = aggregations.totalScienceCollected

	return ok({
		...summary,
		totalScience,
		experimentCount: scienceRecords.length,
		scienceRecords,
		aggregations
	})
}

function extractSummary(
	game: SfsBlock,
	filePath: string
): Omit<SaveSummary, 'totalScience' | 'experimentCount'> {
	const fileName = path.basename(filePath)
	const folderName = path.basename(path.dirname(filePath))
	const gameVersion = stringField(game.version) ?? 'unknown'
	const modeRaw = stringField(game.Mode) ?? 'SANDBOX'
	const mode = isGameMode(modeRaw) ? modeRaw : 'SANDBOX'
	return { path: filePath, fileName, folderName, gameVersion, mode }
}

function extractScienceRecord(block: SfsBlock): ScienceRecord | null {
	const rawId = stringField(block.id)
	if (!rawId) return null
	const parsed = parseScienceId(rawId)
	if (!parsed.ok) return null

	return {
		rawId,
		experimentId: parsed.value.experimentId,
		body: parsed.value.body,
		situation: parsed.value.situation,
		biome: parsed.value.biome,
		title: stringField(block.title) ?? '',
		collected: numberField(block.sci, 0),
		total: numberField(block.cap, 0)
	}
}

function buildAggregations(records: ScienceRecord[]): SaveAggregations {
	const perBody: Record<string, BodyStats> = {}
	let total = 0

	for (const record of records) {
		total += record.collected

		const body = (perBody[record.body] ??= {
			body: record.body,
			scienceCollected: 0,
			experimentCount: 0,
			perSituation: {},
			deployedPerSituation: {},
			recoveries: {}
		})
		body.scienceCollected += record.collected
		body.experimentCount += 1

		if (RECOVERY_SET.has(record.situation)) {
			const sit = record.situation as RecoverySituation
			const rec = (body.recoveries[sit] ??= {
				recovery: sit,
				scienceCollected: 0,
				perExperiment: {}
			})
			rec.scienceCollected += record.collected
			rec.perExperiment[record.experimentId] = record
		} else {
			// per esclusione: situation è StandardSituation
			const sit = record.situation as StandardSituation
			const target = DEPLOYED_SET.has(record.experimentId)
				? body.deployedPerSituation
				: body.perSituation
			const sitStats = (target[sit] ??= {
				situation: sit,
				scienceCollected: 0,
				recordCount: 0,
				biomes: {},
				global: {}
			})
			sitStats.scienceCollected += record.collected
			sitStats.recordCount += 1
			if (record.biome) {
				const b = (sitStats.biomes[record.biome] ??= {
					biome: record.biome,
					perExperiment: {}
				})
				b.perExperiment[record.experimentId] = record
			} else {
				sitStats.global[record.experimentId] = record
			}
		}
	}

	return { perBody, totalScienceCollected: total }
}

// === helpers ===

function isBlock(v: SfsValue | SfsValue[] | undefined): v is SfsBlock {
	return typeof v === 'object' && v !== null && !Array.isArray(v)
}

function asArray(v: SfsValue | SfsValue[] | undefined): SfsValue[] {
	if (v === undefined) return []
	return Array.isArray(v) ? v : [v]
}

function stringField(v: SfsValue | SfsValue[] | undefined): string | null {
	return typeof v === 'string' ? v : null
}

function numberField(v: SfsValue | SfsValue[] | undefined, fallback: number): number {
	if (typeof v !== 'string') return fallback
	const n = parseFloat(v)
	return Number.isFinite(n) ? n : fallback
}

function isGameMode(s: string): s is GameMode {
	return s === 'CAREER' || s === 'SCIENCE_SANDBOX' || s === 'SANDBOX'
}
