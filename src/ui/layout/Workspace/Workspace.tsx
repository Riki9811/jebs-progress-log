import Sidebar from '../../components/Sidebar/Sidebar'
import SidebarPanels from '../SidebarPanels/SidebarPanels'
import SaveViewer from '../SaveViewer/SaveViewer'
import SelectedSaveProvider from '../../context/SelectedSaveProvider'
import { useSettings } from '../../hooks/useSettings'
import styles from './Workspace.module.css'

type Props = {
	folders: SaveFolder[]
}

function Workspace({ folders }: Props) {
	const { settings, update } = useSettings()

	return (
		<SelectedSaveProvider>
			<div className={styles.root}>
				{settings.sidebarVisible && (
					<Sidebar
						initialWidth={settings.sidebarWidth}
						onWidthCommit={(sidebarWidth) => update({ sidebarWidth })}
					>
						<SidebarPanels folders={folders} />
					</Sidebar>
				)}
				<SaveViewer />
			</div>
		</SelectedSaveProvider>
	)
}

export default Workspace
