import { type CSSProperties } from 'react'
import styles from './ValueCell.module.css'

export type CellValue = { collected: number; total: number }

type Props = CellValue

function fmt(n: number): string {
	const r = Math.round(n * 10) / 10
	return Number.isInteger(r) ? String(r) : r.toFixed(1)
}

// Shows collected/total and tints its background red→yellow→green by fill ratio;
// the colour scale itself lives in the CSS module. Suits any table cell backed by
// a value/max pair. A total of 0 or less renders empty.
function ValueCell({ collected, total }: Props) {
	if (total <= 0) return <div className={styles.empty} />

	const fill = Math.min(Math.max(collected / total, 0), 1)
	return (
		<div className={styles.cell} style={{ '--fill': fill } as CSSProperties}>
			{fmt(collected)}/{fmt(total)}
		</div>
	)
}

export default ValueCell
