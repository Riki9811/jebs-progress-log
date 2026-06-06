import clsx from 'clsx'
import ThemeToggle from '../../components/ThemeToggle/ThemeToggle'
import styles from './Footer.module.css'
import { useError } from '../../hooks/useError'

type Props = {
	savesCount: number
}

function Footer({ savesCount }: Props) {
	const { message: error } = useError()

	return (
		<footer className={error ? `${styles.root} ${styles.hasError}` : styles.root}>
			{error && <span className={styles.error}>{error}</span>}
			<span className={clsx(styles.selfCenter, error && styles.leftSpace)}>
				{savesCount} save(s) loaded
			</span>
			<ThemeToggle className={styles.toggle} />
		</footer>
	)
}

export default Footer
