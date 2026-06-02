import { useEffect, useState } from 'react'
import styles from './App.module.css'
import Header from './layout/Header/Header'
import Footer from './layout/Footer/Footer'
import Workspace from './layout/Workspace/Workspace'
import ThemeProvider from './context/ThemeProvider'

function App() {
	const [folders, setFolders] = useState<SaveFolder[]>([])
	const [err, setErr] = useState('')

	useEffect(() => {
		async function fetchData() {
			const folderData = await window.electron.getSaveFolders()
			if (!folderData.ok) setErr(`getSaveFolders(): ${folderData.error.code}`)
			else setFolders(folderData.value)
		}
		fetchData()
	}, [])

	return (
		<ThemeProvider>
			<div className={styles.shell}>
				<Header />
				<Workspace folders={folders} />
				<Footer savesCount={folders.length} error={err} />
			</div>
		</ThemeProvider>
	)
}

export default App
