import { RECOVERY_SITUATIONS } from '../reference/situations.js'
import { DEPLOYED_EXPERIMENT_NAMES } from '../reference/experiments.js'

const RECOVERY_SET = new Set<string>(RECOVERY_SITUATIONS)
const DEPLOYED_SET = new Set<string>(DEPLOYED_EXPERIMENT_NAMES)

// Builds per-body aggregates. Each record is routed to one of 3 channels:
// - recovery situation → `recoveries`
// - deployed experiment in a standard situation → `deployedPerSituation`
// - everything else (standard activity in a standard situation) → `perSituation`
export function buildAggregations(records: ScienceRecord[]): SaveAggregations {
	const perBody: Record<string, BodyStats> = {}
	let total = 0

	for (const record of records) {
		total += record.collected

		const body = (perBody[record.body] ??= {
			body: record.body,
			scienceCollected: 0,
			scienceTotal: 0,
			experimentCount: 0,
			perSituation: {},
			deployedPerSituation: {},
			recoveries: {}
		})
		body.scienceCollected += record.collected
		// TODO: scienceTotal is the cap summed over discovered records only — i.e.
		// completion of what's been started. Replace with the body's theoretical
		// maximum (experiments x situations x biomes from reference) when that
		// (heavy) computation lands.
		body.scienceTotal += record.total
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
			// by exclusion: situation is a StandardSituation
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
