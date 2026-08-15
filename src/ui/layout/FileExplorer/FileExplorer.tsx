import { useState } from 'react'
import ScrollBox from '../../components/ScrollBox/ScrollBox'
import FolderElement from './FolderElement/FolderElement'
import { useError } from '../../hooks/useError'
import styles from './FileExplorer.module.css'

export type FileError = ListSavesResult['errors'][number]

export type FolderLoad =
	| { status: 'idle' }
	| { status: 'loading' }
	| {
			status: 'loaded'
			files: SaveSummary[]
			fileErrors: FileError[]
			persistent: SaveSummary | undefined
	  }
	| { status: 'error'; code: FolderAccessError['code'] | FrameError['code'] }

type FolderEntry = { open: boolean; load: FolderLoad }

const CLOSED_IDLE: FolderEntry = { open: false, load: { status: 'idle' } }

type Props = {
	folders: SaveFolder[]
}

function FileExplorer({ folders }: Props) {
	const [entries, setEntries] = useState<Record<string, FolderEntry>>({})
	const { setError } = useError()

	// Pushes a folder's failure to the footer as one overwriting message: the error
	// code for a whole-folder failure, the failed file names for a partial load,
	// nothing at all for a clean one.
	function reportError(name: string, load: FolderLoad) {
		if (load.status === 'error') {
			setError(`${name}: ${load.code}`)
		} else if (load.status === 'loaded' && load.fileErrors.length > 0) {
			const names = load.fileErrors.map((fe) => fe.fileName).join(', ')
			setError(`${name}: ${names}`)
		}
	}

	async function onToggle(path: string) {
		const current = entries[path] ?? CLOSED_IDLE
		const opening = !current.open
		const name = folders.find((f) => f.path === path)?.name ?? path

		setEntries((prev) => ({ ...prev, [path]: { ...current, open: opening } }))

		if (!opening) return

		// Already loaded (cached): re-surface its errors without refetching.
		if (current.load.status !== 'idle') {
			reportError(name, current.load)
			return
		}

		setEntries((prev) => ({ ...prev, [path]: { open: true, load: { status: 'loading' } } }))

		const result = await window.electron.listSavesInFolder(path)
		const load: FolderLoad = result.ok
			? {
					status: 'loaded',
					files: result.value.summaries,
					fileErrors: result.value.errors,
					persistent: result.value.summaries.find((s) => s.fileName === 'persistent.sfs')
				}
			: { status: 'error', code: result.error.code }

		setEntries((prev) => ({ ...prev, [path]: { open: prev[path]?.open ?? true, load } }))
		reportError(name, load)
	}

	return (
		<div className={styles.root}>
			<h6 className={styles.sectionTitle}>Saves</h6>
			<div className={styles.scrollArea}>
				<ScrollBox vScroll>
					<div className={styles.list}>
						{folders.map((f) => {
							const entry = entries[f.path] ?? CLOSED_IDLE
							return (
								<FolderElement
									key={f.path}
									folder={f}
									open={entry.open}
									load={entry.load}
									onToggle={onToggle}
								/>
							)
						})}
                        <div className={styles.listEnd}/>
					</div>
				</ScrollBox>
			</div>
		</div>
	)
}

export default FileExplorer
