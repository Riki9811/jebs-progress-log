import ScrollBox from '../../components/ScrollBox/ScrollBox'
import styles from './FileExplorer.module.css'

type Props = {
	folders: SaveFolder[]
}

function FileExplorer({ folders }: Props) {
	return (
		<div className={styles.root}>
			<h6 className={styles.sectionTitle}>Saves</h6>
			<div className={styles.scrollArea}>
				<ScrollBox vScroll>
					<div className={styles.list}>
						{folders.map((f) => (
							<div key={f.path} className={styles.item} title={f.path}>
								{f.name}
							</div>
						))}
					</div>
				</ScrollBox>
			</div>
		</div>
	)
}

export default FileExplorer
