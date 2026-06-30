import clsx from 'clsx'
import FileExplorer from '../FileExplorer/FileExplorer'
import FileDetail from '../FileDetail/FileDetail'
import { useSaveState } from '../../hooks/useSaveState'
import styles from './SidebarPanels.module.css'

type Props = {
	folders: SaveFolder[]
}

function SidebarPanels({ folders }: Props) {
	const { view } = useSaveState()

	return (
		<div className={clsx(styles.slider, view === 'detail' && styles.detail)}>
			<FileExplorer folders={folders} />
			<FileDetail />
		</div>
	)
}

export default SidebarPanels
