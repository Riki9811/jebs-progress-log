import ThemeToggle from '../../components/ThemeToggle/ThemeToggle'
import styles from './Footer.module.css'

type Props = {
	savesCount: number
}

function Footer({ savesCount }: Props) {
	return (
		<footer className={styles.root}>
			<span className={styles.selfCenter}>{savesCount} save(s) loaded</span>
			<ThemeToggle className={styles.toggle} />
		</footer>
	)
}

export default Footer
