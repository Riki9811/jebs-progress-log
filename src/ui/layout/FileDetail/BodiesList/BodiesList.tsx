import clsx from 'clsx'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'
import ScrollBox from '../../../components/ScrollBox/ScrollBox'
import type { SaveDataLoad } from '../../../context/SelectedSaveContext'
import styles from './BodiesList.module.css'

type Props = {
	data: SaveDataLoad
	reference: ReferenceData | null
	query: string
}

function BodiesList({ data, reference, query }: Props) {
	if (data.status === 'error') {
		return <p className={styles.note}>Could not load this save.</p>
	}
	if (data.status !== 'loaded' || !reference) {
		return <FontAwesomeIcon icon={faSpinner} spin size="2x" className={styles.spinner} />
	}

	const bodiesRef = reference.bodies
	const displayName = (raw: string) => bodiesRef.find((b) => b.name === raw)?.displayName ?? raw

	const visited = Object.values(data.value.aggregations.perBody)
		.map((b) => ({
			name: b.body,
			display: displayName(b.body),
			pct: b.scienceTotal > 0 ? (b.scienceCollected / b.scienceTotal) * 100 : 0
		}))
		.sort((a, b) => b.pct - a.pct)

	const visitedNames = new Set(visited.map((v) => v.name))
	const toExplore = bodiesRef
		.filter((b) => !visitedNames.has(b.name))
		.map((b) => ({ name: b.name, display: b.displayName }))

	const q = query.trim().toLowerCase()
	const matchVisited = q ? visited.filter((v) => v.display.toLowerCase().includes(q)) : visited
	const matchToExplore = q ? toExplore.filter((b) => b.display.toLowerCase().includes(q)) : toExplore

	return (
		<ScrollBox vScroll className={styles.scrollBox}>
			{matchVisited.length > 0 && (
				<>
					<h6 className={clsx(styles.sectionLabel, styles.visitedLabel)}>Visited</h6>
					{matchVisited.map((v) => (
						<div key={v.name} className={styles.bodyRow}>
							<span className={styles.bodyName}>{v.display}</span>
							<div className={styles.bar}>
								<div className={styles.barFill} style={{ width: `${v.pct}%` }} />
							</div>
							<span className={styles.bodyPct}>{Math.round(v.pct)}%</span>
						</div>
					))}
				</>
			)}
			{matchToExplore.length > 0 && (
				<>
					<h6 className={styles.sectionLabel}>To explore</h6>
					{matchToExplore.map((b) => (
						<div key={b.name} className={styles.exploreRow}>
							{b.display}
						</div>
					))}
				</>
			)}
		</ScrollBox>
	)
}

export default BodiesList
