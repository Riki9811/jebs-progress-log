import path from 'path'
import { parseSfs, type SfsBlock } from '../parser/sfsParser.js'
import { parseScienceId } from '../parser/scienceIdParser.js'
import { isBlock, asArray, stringField, numberField } from '../parser/sfsHelpers.js'
import { buildAggregations } from './aggregateScience.js'
import { ok, err } from '../result.js'

export type ExtractFailure = { type: 'PARSE'; line: number; reason: string } | { type: 'NO_GAME_BLOCK' }

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

function isGameMode(s: string): s is GameMode {
	return s === 'CAREER' || s === 'SCIENCE_SANDBOX' || s === 'SANDBOX'
}
