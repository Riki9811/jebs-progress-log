import clsx from 'clsx'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
	faChevronRight,
	faRocket,
	faFlask,
	faBoxOpen,
	type IconDefinition
} from '@fortawesome/free-solid-svg-icons'
import FileElement from '../FileElement/FileElement'
import ErrorFileElement from '../ErrorFileElement/ErrorFileElement'
import ErrorRow from '../ErrorRow/ErrorRow'
import type { FolderLoad } from '../FileExplorer'
import styles from './FolderElement.module.css'

const modeIcon: Record<GameMode, IconDefinition> = {
	CAREER: faRocket,
	SCIENCE_SANDBOX: faFlask,
	SANDBOX: faBoxOpen
}

type Props = {
	folder: SaveFolder
	open: boolean
	load: FolderLoad
	onToggle: (path: string) => void
}

function FolderElement({ folder, open, load, onToggle }: Props) {
	const persistent = load.status === 'loaded' ? load.persistent : undefined

	return (
		<div className={styles.root}>
			<button type="button" className={styles.header} onClick={() => onToggle(folder.path)}>
				<FontAwesomeIcon
					icon={faChevronRight}
					className={clsx(styles.caret, open && styles.caretOpen)}
				/>
				<span className={styles.name}>{folder.name}</span>
				{persistent && (
					<span className={styles.metaInfo}>
						<FontAwesomeIcon icon={modeIcon[persistent.mode]} title={persistent.mode} />
						<span>v{persistent.gameVersion}</span>
					</span>
				)}
			</button>

			<div className={clsx(styles.body, open && styles.bodyOpen)}>
				<div className={styles.bodyInner}>
					{load.status === 'loading' && <p className={styles.note}>Loading…</p>}
					{load.status === 'error' && <ErrorRow title={folder.name} detail={load.code} />}
					{load.status === 'loaded' && (
						<>
							{load.files.map((summary) => (
								<FileElement key={summary.path} summary={summary} />
							))}
							{load.fileErrors.map((fe) => (
								<ErrorFileElement key={fe.fileName} fileName={fe.fileName} error={fe.error} />
							))}
						</>
					)}
				</div>
			</div>
		</div>
	)
}

export default FolderElement
