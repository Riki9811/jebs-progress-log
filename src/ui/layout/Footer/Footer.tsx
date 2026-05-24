import styles from './Footer.module.css'

type Props = {
	savesCount: number
}

function Footer({ savesCount }: Props) {
	return (
		<footer className={styles.root}>
			<span>{savesCount} save(s) loaded</span>
		</footer>
	)
}

export default Footer
