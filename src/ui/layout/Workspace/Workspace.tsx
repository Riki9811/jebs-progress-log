import Sidebar from '../../components/Sidebar/Sidebar'
import SidebarPanels from '../SidebarPanels/SidebarPanels'
import SaveViewer from '../SaveViewer/SaveViewer'
import SelectedSaveProvider from '../../context/SelectedSaveProvider'
import styles from './Workspace.module.css'

type Props = {
	folders: SaveFolder[]
}

function Workspace({ folders }: Props) {
	return (
		<SelectedSaveProvider>
			<div className={styles.root}>
				<Sidebar>
					<SidebarPanels folders={folders} />
				</Sidebar>
				<SaveViewer />
			</div>
		</SelectedSaveProvider>
	)
}

export default Workspace
