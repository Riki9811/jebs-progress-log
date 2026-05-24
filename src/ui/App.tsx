import { useEffect, useState } from 'react'
import styles from './App.module.css'

function App() {
	const [folders, setFolders] = useState<SaveFolder[]>([])
	const [err, setErr] = useState('')
	const [theme, setTheme] = useState<'dark' | 'light'>('dark')

	useEffect(() => {
		async function fetchData() {
			const folderData = await window.electron.getSaveFolders()
			if (!folderData.ok) setErr(folderData.error.code)
			else setFolders(folderData.value)
		}
		fetchData()
	}, [])

	useEffect(() => {
		document.body.classList.toggle('lightTheme', theme === 'light')
	}, [theme])

	// =========================================================================
	// DEMO SHELL — temporary scaffolding to show off the design tokens.
	// To start the real UI, delete this whole <div className={styles.shell}>.
	// =========================================================================
	return (
		<div className={styles.shell}>
			<header className={styles.titleBar}>
				<nav className={styles.titleBarMenu}>
					<span>File</span>
					<span>Edit</span>
					<span>Selection</span>
					<span>View</span>
					<span>Help</span>
				</nav>
				<div className={styles.titleBarTitle}>jebs-progress-log</div>
			</header>

			<div className={styles.body}>
				<nav className={styles.activityBar}>
					<span>◰</span>
					<span>⌕</span>
					<span>⎇</span>
				</nav>

				<aside className={styles.sidebar}>
					<h6>Saves</h6>
					{err && <p>ReadError: {err}</p>}
					{folders.map((f) => (
						<p key={f.path}>{f.name}</p>
					))}
				</aside>

				<main className={styles.main}>
					<section className={styles.demoBlock}>
						<h1>Jeb's Progress Log</h1>
						<h2>Subtitle — typography baseline</h2>
						<h3>Section heading (H3)</h3>
						<p>
							Paragraph copy renders with the default body font and the semantic
							<code> --textCol </code> token. Long lines, no fuss. Lorem ipsum dolor
							sit amet, consectetur adipiscing elit.
						</p>
						<small>Small / muted helper text</small>
					</section>

					<section className={styles.demoBlock}>
						<h6>Form elements</h6>
						<div className={styles.row}>
							<label htmlFor="demo-input">Label</label>
							<input id="demo-input" type="text" placeholder="Type something…" />
						</div>
						<div className={styles.row}>
							<button type="button">Default button</button>
							<button type="button" className="primary">
								Primary button
							</button>
							<button type="button" disabled>
								Disabled
							</button>
						</div>
					</section>

					<section className={styles.demoBlock}>
						<h6>Theme</h6>
						<div className={styles.row}>
							<button
								type="button"
								className="primary"
								onClick={() => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))}
							>
								Toggle theme
							</button>
							<small>current: {theme}</small>
						</div>
					</section>
				</main>
			</div>

			<footer className={styles.statusBar}>
				<span>{folders.length} save(s) loaded</span>
			</footer>
		</div>
	)
}

export default App
