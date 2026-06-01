import { type ReactNode } from 'react'
import styles from './ScrollBox.module.css'

type Props = {
	children: ReactNode
	vScroll?: boolean
	hScroll?: boolean
	className?: string
}

function ScrollBox({ children, vScroll = false, hScroll = false, className }: Props) {
	const classes = [
		styles.root,
		vScroll ? styles.vAuto : styles.vHidden,
		hScroll ? styles.hAuto : styles.hHidden,
		className
	]
		.filter(Boolean)
		.join(' ')

	return <div className={classes}>{children}</div>
}

export default ScrollBox
