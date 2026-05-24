import styles from './Header.module.css'

function Header() {
	return (
		<header className={styles.root}>
			<nav className={styles.menu}>
				<span>File</span>
				<span>Edit</span>
				<span>Selection</span>
				<span>View</span>
				<span>Help</span>
			</nav>
			<div className={styles.title}>Jeb's Progress Log</div>
		</header>
	)
}

export default Header
