import Sidebar from '../../components/Sidebar/Sidebar'
import FileExplorer from '../FileExplorer/FileExplorer'
import SaveViewer from '../SaveViewer/SaveViewer'
import styles from './Workspace.module.css'

type Props = {
	folders: SaveFolder[]
	err: string
}

function Workspace({ folders, err }: Props) {
	return (
		<div className={styles.root}>
			<Sidebar>
				<FileExplorer folders={folders} err={err} />
			</Sidebar>
			<SaveViewer />
		</div>
	)
}

export default Workspace
