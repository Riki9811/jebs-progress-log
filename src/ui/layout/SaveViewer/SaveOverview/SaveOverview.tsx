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

// Vessel recovery is a single experiment id spread across the recovery situations,
// so its table is keyed by situation rather than by experiment.
const RECOVERY_EXPERIMENT = 'recovery'

// Raw camelCase/PascalCase biome id -> spaced label ("GrasslandsValley" -> "Grasslands Valley").
const spaced = (s: string) => s.replace(/([a-z])([A-Z])/g, '$1 $2')

function fmt(n: number): string {
	const r = Math.round(n * 10) / 10
	return Number.isInteger(r) ? String(r) : r.toFixed(1)
}

function accumulate(map: Map<string, CellValue>, key: string, record: ScienceRecord): void {
	const cur = map.get(key) ?? { collected: 0, total: 0 }
	cur.collected += record.collected
	cur.total += record.total
	map.set(key, cur)
}

function SaveOverview({ save, reference }: Props) {
	const view = useMemo(() => {
		const bodyName = (raw: string) => reference.bodies.find((b) => b.name === raw)?.displayName ?? raw

		const expName = new Map<string, string>()
		for (const a of reference.activities) expName.set(a.name, a.displayName)
		for (const d of reference.deployedExperiments) expName.set(d.name, d.displayName)
		// Surface features and vessel recovery produce records too; without their
		// names the stats would fall back to raw science ids.
		for (const b of reference.bodies) for (const r of b.ROCScience) expName.set(r.name, r.displayName)
		expName.set(RECOVERY_EXPERIMENT, 'Vessel Recovery')

		// Recovery situations share display names across bodies, and the per-body
		// `recovery` lists are the reference's source of truth for those labels.
		const recoveryName = new Map<string, string>()
		for (const b of reference.bodies) for (const r of b.recovery) recoveryName.set(r.name, r.displayName)

		// body|experiment -> value, for the experiment / sample / deployed tables.
		const matrix = new Map<string, CellValue>()
		// body|situation -> value, for the recovery table (only `recovery` records, so
		// ordinary experiments flown in a recovery situation aren't counted twice).
		const recoveryMatrix = new Map<string, CellValue>()
		// body|biome -> collected, and experimentId -> collected, for the stats.
		const perBiome = new Map<string, number>()
		const perExp = new Map<string, number>()

		for (const r of save.scienceRecords) {
			accumulate(matrix, `${r.body}|${r.experimentId}`, r)
			if (r.experimentId === RECOVERY_EXPERIMENT) {
				accumulate(recoveryMatrix, `${r.body}|${r.situation}`, r)
			}

			perExp.set(r.experimentId, (perExp.get(r.experimentId) ?? 0) + r.collected)
			if (r.biome) {
				const bk = `${r.body}|${r.biome}`
				perBiome.set(bk, (perBiome.get(bk) ?? 0) + r.collected)
			}
		}

		const activityColumns: HeatMapHeader[] = reference.activities.map((a) => ({
			key: a.name,
			label: a.displayName,
			title: a.displayName
		}))
		const deployedColumns: HeatMapHeader[] = reference.deployedExperiments.map((d) => ({
			key: d.name,
			label: d.displayName,
			title: d.displayName
		}))
		const recoveryColumns: HeatMapHeader[] = reference.recoverySituations.map((s) => ({
			key: s,
			label: recoveryName.get(s) ?? s,
			title: recoveryName.get(s) ?? s
		}))

		// A body appears in a table only if it has at least one record in that table's columns.
		const rowsFor = (cols: HeatMapHeader[], m: Map<string, CellValue>): HeatMapHeader[] =>
			reference.bodies
				.filter((b) => cols.some((c) => m.has(`${b.name}|${c.key}`)))
				.map((b) => ({ key: b.name, label: b.displayName, title: b.displayName }))

		const cellFrom = (m: Map<string, CellValue>) => (rowKey: string, colKey: string) =>
			m.get(`${rowKey}|${colKey}`) ?? null

		// Each table is a (columns, matrix) pair that rows and getCell derive from.
		// Tables with no matching record in this save are dropped.
		const tables = [
			{
				key: 'experiments',
				label: 'Experiments',
				columns: activityColumns.filter((c) => !isSample(c.key)),
				matrix
			},
			{
				key: 'samples',
				label: 'Samples',
				columns: activityColumns.filter((c) => isSample(c.key)),
				matrix
			},
			{ key: 'deployed', label: 'Deployed Experiments', columns: deployedColumns, matrix },
			{
				key: 'recovery',
				label: 'Vessel Recovery',
				columns: recoveryColumns,
				matrix: recoveryMatrix
			}
		]
			.map(({ key, label, columns, matrix: m }) => ({
				key,
				label,
				columns,
				rows: rowsFor(columns, m),
				getCell: cellFrom(m)
			}))
			.filter((t) => t.rows.length > 0)

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

		return { tables, stats }
	}, [save, reference])

	const { settings } = useSettings()
	const fit = settings.tableFit

	return (
		<div className={styles.root}>
			<ScrollBox vScroll className={styles.scroll}>
				<div className={styles.content}>
					{view.tables.length > 0 ? (
						<>
							{view.tables.map((t) => (
								<section key={t.key}>
									<h6 className={styles.sectionLabel}>{t.label}</h6>
									<ScrollBox hScroll>
										<HeatMap rows={t.rows} columns={t.columns} getCell={t.getCell} fit={fit} />
									</ScrollBox>
								</section>
							))}
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
