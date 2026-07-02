import { type CSSProperties } from 'react'
import styles from './ValueCell.module.css'

export type CellValue = { collected: number; total: number }

type Props = CellValue

// Compact numeric label: integers as-is, otherwise one decimal.
function fmt(n: number): string {
	const r = Math.round(n * 10) / 10
	return Number.isInteger(r) ? String(r) : r.toFixed(1)
}

// A single value cell: shows collected/total and tints its background red→yellow→green
// by fill ratio. The colour scale is owned by CSS (see module). Reusable in any table
// where a value/max pair should read as a filled cell. total <= 0 renders empty.
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
