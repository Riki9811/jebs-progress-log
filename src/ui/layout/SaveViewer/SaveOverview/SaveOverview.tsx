import { useMemo } from 'react'
import ScrollBox from '../../../components/ScrollBox/ScrollBox'
import HeatMap, { type HeatMapHeader } from '../../../components/HeatMap/HeatMap'
import { type CellValue } from '../../../components/ValueCell/ValueCell'
import { useSettings } from '../../../hooks/useSettings'
import styles from './SaveOverview.module.css'

type Props = {
	save: SaveData
	reference: ReferenceData
}

// Sample-collection experiments (asteroid, surface, every comet tier) get their
// own heatmap; all other activities go in the main one.
const isSample = (name: string) =>
	name === 'asteroidSample' || name === 'surfaceSample' || name.startsWith('cometSample')

// Raw camelCase/PascalCase biome id -> spaced label ("GrasslandsValley" -> "Grasslands Valley").
const spaced = (s: string) => s.replace(/([a-z])([A-Z])/g, '$1 $2')

function fmt(n: number): string {
	const r = Math.round(n * 10) / 10
	return Number.isInteger(r) ? String(r) : r.toFixed(1)
}

function SaveOverview({ save, reference }: Props) {
	const view = useMemo(() => {
		const bodyName = (raw: string) => reference.bodies.find((b) => b.name === raw)?.displayName ?? raw
		const expName = new Map<string, string>()
		for (const a of reference.activities) expName.set(a.name, a.displayName)
		for (const d of reference.deployedExperiments) expName.set(d.name, d.displayName)

		// body|experiment -> { collected, total }
		const matrix = new Map<string, CellValue>()
		// body|biome -> collected, and experimentId -> collected, for the stats.
		const perBiome = new Map<string, number>()
		const perExp = new Map<string, number>()

		for (const r of save.scienceRecords) {
			const mk = `${r.body}|${r.experimentId}`
			const cur = matrix.get(mk) ?? { collected: 0, total: 0 }
			cur.collected += r.collected
			cur.total += r.total
			matrix.set(mk, cur)

			perExp.set(r.experimentId, (perExp.get(r.experimentId) ?? 0) + r.collected)
			if (r.biome) {
				const bk = `${r.body}|${r.biome}`
				perBiome.set(bk, (perBiome.get(bk) ?? 0) + r.collected)
			}
		}

		const allColumns: HeatMapHeader[] = reference.activities.map((a) => ({
			key: a.name,
			label: a.displayName,
			title: a.displayName
		}))
		const sampleColumns = allColumns.filter((c) => isSample(c.key))
		const mainColumns = allColumns.filter((c) => !isSample(c.key))

		// A body appears in a table only if it has at least one record in that table's columns.
		const rowsFor = (cols: HeatMapHeader[]): HeatMapHeader[] =>
			reference.bodies
				.filter((b) => cols.some((c) => matrix.has(`${b.name}|${c.key}`)))
				.map((b) => ({ key: b.name, label: b.displayName, title: b.displayName }))

		const getCell = (rowKey: string, colKey: string) => matrix.get(`${rowKey}|${colKey}`) ?? null

		const bestBiome = [...perBiome.entries()].sort((a, b) => b[1] - a[1])[0]
		const topExp = [...perExp.entries()].sort((a, b) => b[1] - a[1])[0]
		const stats = {
			bodiesVisited: Object.keys(save.aggregations.perBody).length,
			bodiesTotal: reference.bodies.length,
			biomesExplored: perBiome.size,
			bestBiome: bestBiome
				? `${bodyName(bestBiome[0].split('|')[0])} ${spaced(bestBiome[0].split('|')[1])} (${fmt(bestBiome[1])})`
				: '—',
			topExperiment: topExp ? `${expName.get(topExp[0]) ?? topExp[0]} (${fmt(topExp[1])})` : '—'
		}

		return {
			mainColumns,
			sampleColumns,
			mainRows: rowsFor(mainColumns),
			sampleRows: rowsFor(sampleColumns),
			getCell,
			stats
		}
	}, [save, reference])

	const { settings } = useSettings()
	const fit = settings.tableFit
	const hasData = view.mainRows.length > 0 || view.sampleRows.length > 0

	return (
		<div className={styles.root}>
			<ScrollBox vScroll className={styles.scroll}>
				<div className={styles.content}>
					{hasData ? (
						<>
							{view.mainRows.length > 0 && (
								<section>
									<h6 className={styles.sectionLabel}>Experiments</h6>
									<ScrollBox hScroll>
										<HeatMap rows={view.mainRows} columns={view.mainColumns} getCell={view.getCell} fit={fit} />
									</ScrollBox>
								</section>
							)}
							{view.sampleRows.length > 0 && (
								<section>
									<h6 className={styles.sectionLabel}>Samples</h6>
									<ScrollBox hScroll>
										<HeatMap rows={view.sampleRows} columns={view.sampleColumns} getCell={view.getCell} fit={fit} />
									</ScrollBox>
								</section>
							)}
							<ul className={styles.stats}>
								<li>
									Bodies visited: {view.stats.bodiesVisited} / {view.stats.bodiesTotal}
								</li>
								<li>Biomes explored: {view.stats.biomesExplored}</li>
								<li>Best biome: {view.stats.bestBiome}</li>
								<li>Top experiment: {view.stats.topExperiment}</li>
							</ul>
						</>
					) : (
						<p className={styles.hint}>No science recorded in this save yet.</p>
					)}
				</div>
			</ScrollBox>
		</div>
	)
}

export default SaveOverview
