import { useEffect, useState } from 'react'
import styles from './App.module.css'
import Header from './layout/Header/Header'
import Footer from './layout/Footer/Footer'
import Workspace from './layout/Workspace/Workspace'
import { useError } from './hooks/useError'

function App() {
	const [folders, setFolders] = useState<SaveFolder[]>([])
	const { setError } = useError()

	useEffect(() => {
		async function fetchData() {
			const folderData = await window.electron.getSaveFolders()
			if (!folderData.ok) setError(`getSaveFolders(): ${folderData.error.code}`)
			else setFolders(folderData.value)
		}
		fetchData()
	}, [setError])

	return (
		<div className={styles.shell}>
			<Header />
			<Workspace folders={folders} />
			<Footer savesCount={folders.length} />
		</div>
	)
}

export default App
