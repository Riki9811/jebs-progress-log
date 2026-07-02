import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'
import Jpl from '../../assets/jpl.svg?react'
import SaveOverview from './SaveOverview/SaveOverview'
import { useSaveState } from '../../hooks/useSaveState'
import styles from './SaveViewer.module.css'

function SaveViewer() {
	const { reference, selected, data } = useSaveState()

	if (!selected) {
		return (
			<div className={styles.root}>
				<div className={styles.empty}>
					<Jpl role="img" aria-label="Jeb's Progress Log" className={styles.logo} />
					<p className={styles.hint}>Select a save file to start viewing its data.</p>
				</div>
			</div>
		)
	}

	if (data.status === 'error') {
		return (
			<div className={styles.root}>
				<p className={styles.hint}>Could not load this save.</p>
			</div>
		)
	}

	if (data.status !== 'loaded' || !reference) {
		return (
			<div className={styles.root}>
				<FontAwesomeIcon icon={faSpinner} spin size="2x" className={styles.hint} />
			</div>
		)
	}

	return <SaveOverview save={data.value} reference={reference} />
}

export default SaveViewer
