import styles from './ErrorRow.module.css'

type Props = {
	title: string
	detail: string
	showTitle?: boolean
}

function ErrorRow({ title, detail, showTitle = false }: Props) {
	return (
		<div className={styles.root} title={title}>
			{showTitle && <span className={styles.title}>{title}</span>}
			<span className={styles.detail}>{detail}</span>
		</div>
	)
}

export default ErrorRow
