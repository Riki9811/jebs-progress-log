import { useTheme } from '../../hooks/useTheme'
import styles from './Workspace.module.css'

const ThemeCycle: Record<Preferences['theme'], Preferences['theme']> = {
	system: 'dark',
	dark: 'light',
	light: 'system'
}

type Props = {
	folders: SaveFolder[]
	err: string
}

function Workspace({ folders, err }: Props) {
	const { theme, setTheme } = useTheme()

	function onSwitchTheme() {
		setTheme(ThemeCycle[theme])
	}

	return (
		<div className={styles.root}>
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
						<code> --textCol </code> token. Long lines, no fuss. Lorem ipsum dolor sit amet,
						consectetur adipiscing elit.
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
						<button type="button" className="primary" onClick={onSwitchTheme}>
							Switch theme
						</button>
						<small>current: {theme}</small>
					</div>
				</section>
			</main>
		</div>
	)
}

export default Workspace
