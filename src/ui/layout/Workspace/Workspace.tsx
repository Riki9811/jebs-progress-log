import Sidebar from '../../components/Sidebar/Sidebar'
import FileExplorer from '../FileExplorer/FileExplorer'
import SaveViewer from '../SaveViewer/SaveViewer'
import styles from './Workspace.module.css'

type Props = {
	folders: SaveFolder[]
}

function Workspace({ folders }: Props) {
	return (
		<div className={styles.root}>
			<Sidebar>
				<FileExplorer folders={folders} />
			</Sidebar>
			<SaveViewer />
		</div>
	)
}

export default Workspace
