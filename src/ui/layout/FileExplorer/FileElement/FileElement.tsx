import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import styles from './FileElement.module.css'
import { faCaretRight } from '@fortawesome/free-solid-svg-icons'

type Props = {
	summary: SaveSummary
}

function FileElement({ summary }: Props) {
	return (
		<div className={styles.root} title={summary.fileName}>
			<span className={styles.name}>{summary.fileName}</span>
			<span className={styles.meta}>
				Science: {summary.totalScience.toFixed(1)} | Experiments: {summary.experimentCount}
			</span>
			<FontAwesomeIcon icon={faCaretRight} className={styles.hoverCaret}/>
		</div>
	)
}

export default FileElement
