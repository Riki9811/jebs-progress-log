import Jpl from '../../assets/jpl.svg?react'
import styles from './SaveViewer.module.css'

function SaveViewer() {
	return (
		<div className={styles.root}>
			<div className={styles.empty}>
				<Jpl role="img" aria-label="Jeb's Progress Log" className={styles.logo} />
				<p className={styles.hint}>Select a save file to start viewing its data.</p>
			</div>
		</div>
	)
}

export default SaveViewer
