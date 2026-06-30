import { useRef, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
	faChevronLeft,
	faMagnifyingGlass,
	faRocket,
	faFlask,
	faBoxOpen,
	type IconDefinition,
	faAngleRight
} from '@fortawesome/free-solid-svg-icons'
import { useSaveState } from '../../hooks/useSaveState'
import { useSaveActions } from '../../hooks/useSaveActions'
import BodiesList from './BodiesList/BodiesList'
import styles from './FileDetail.module.css'

const MODE: Record<GameMode, { icon: IconDefinition; label: string }> = {
	CAREER: { icon: faRocket, label: 'Career' },
	SCIENCE_SANDBOX: { icon: faFlask, label: 'Science' },
	SANDBOX: { icon: faBoxOpen, label: 'Sandbox' }
}

function FileDetail() {
	const { reference, selected, data } = useSaveState()
	const { back } = useSaveActions()
	const [query, setQuery] = useState('')
	const searchRef = useRef<HTMLInputElement>(null)

	if (!selected) return <div className={styles.root} />

	const mode = MODE[selected.mode]

	return (
		<div className={styles.root}>
			<button type="button" className={styles.backRow} onClick={back}>
				<FontAwesomeIcon icon={faChevronLeft} />
				<span>All saves</span>
			</button>

			<div className={styles.general}>
				<div className={styles.path} title={`${selected.folderName} > ${selected.fileName}`}>
					<span className={styles.folder}>{selected.folderName}</span>
					<FontAwesomeIcon icon={faAngleRight} className={styles.sep} />
					<span className={styles.file}>{selected.fileName}</span>
				</div>
				<div className={styles.modeLine}>
					<FontAwesomeIcon icon={mode.icon} aria-label={selected.mode} />
					<span>{mode.label}</span>
					<span className={styles.dot}>·</span>
					<span>v{selected.gameVersion}</span>
				</div>
				<div className={styles.stats}>
					Sci: {selected.totalScience.toFixed(1)} · Exp: {selected.experimentCount}
				</div>
			</div>

			<div className={styles.search} onClick={() => searchRef?.current?.focus()}>
				<FontAwesomeIcon icon={faMagnifyingGlass} className={styles.searchIcon} />
				<input
					type="text"
					className={styles.searchInput}
					placeholder="Search body…"
					value={query}
					onChange={(e) => setQuery(e.target.value)}
					ref={searchRef}
				/>
			</div>

			<BodiesList data={data} reference={reference} query={query} />
		</div>
	)
}

export default FileDetail
