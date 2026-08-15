import { type ReactNode } from 'react'
import clsx from 'clsx'
import ValueCell, { type CellValue } from '../ValueCell/ValueCell'
import styles from './HeatMap.module.css'

export type HeatMapHeader = { key: string; label: ReactNode; title?: string }

type Props = {
	rows: HeatMapHeader[]
	columns: HeatMapHeader[]
	// Returns the value for a cell, or null when that row/column pair has no data.
	getCell: (rowKey: string, colKey: string) => CellValue | null
	cornerLabel?: ReactNode
	// 'scroll' (default): columns keep their content width; wrap in a horizontal
	// scroll container. 'shrink': columns compress to fit their container, headers
	// and cells ellipsised.
	fit?: TableFit
}

// Generic value matrix: row headers down the left, column headers across the top,
// a ValueCell at each populated intersection. Domain-agnostic — any rows/columns/
// getCell triple works. The header row and first column stay sticky within an
// enclosing scroll container.
function HeatMap({ rows, columns, getCell, cornerLabel, fit = 'scroll' }: Props) {
	return (
		<table className={clsx(styles.table, fit === 'shrink' && styles.shrink)}>
			<thead>
				<tr>
					<th className={clsx(styles.headCell, styles.corner)}>{cornerLabel}</th>
					{columns.map((c) => (
						<th key={c.key} className={styles.headCell} title={c.title}>
							{c.label}
						</th>
					))}
				</tr>
			</thead>
			<tbody>
				{rows.map((r) => (
					<tr key={r.key}>
						<th scope="row" className={styles.rowHead} title={r.title}>
							{r.label}
						</th>
						{columns.map((c) => {
							const value = getCell(r.key, c.key)
							return (
								<td key={c.key} className={styles.cell}>
									{value && <ValueCell collected={value.collected} total={value.total} />}
								</td>
							)
						})}
					</tr>
				))}
			</tbody>
		</table>
	)
}

export default HeatMap
