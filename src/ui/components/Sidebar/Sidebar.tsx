import { useEffect, useRef, useState, type ReactNode } from 'react'
import styles from './Sidebar.module.css'

type Props = {
	children: ReactNode
	initialWidth?: number
	// Called with the final width when a resize drag ends (for persistence).
	onWidthCommit?: (width: number) => void
}

function Sidebar({ children, initialWidth = 260, onWidthCommit }: Props) {
	const ref = useRef<HTMLElement>(null)
	const [width, setWidth] = useState(initialWidth)
	const [dragging, setDragging] = useState(false)
	// Latest width + commit callback, read in onUp (which closes over stale values)
	// so the drag effect needn't depend on them and re-bind listeners mid-drag.
	const widthRef = useRef(width)
	const commitRef = useRef(onWidthCommit)
	useEffect(() => {
		widthRef.current = width
		commitRef.current = onWidthCommit
	})

	useEffect(() => {
		if (!dragging) return

		function onMove(e: MouseEvent) {
			const el = ref.current
			if (!el) return
			// min/max are owned by CSS (vw units); read them resolved to px so the
			// clamp follows the window size without duplicating the bounds here.
			const cs = getComputedStyle(el)
			const min = parseFloat(cs.minWidth) || 0
			const max = parseFloat(cs.maxWidth) || Infinity
			const next = e.clientX - el.getBoundingClientRect().left
			setWidth(Math.min(Math.max(next, min), max))
		}
		function onUp() {
			setDragging(false)
			commitRef.current?.(widthRef.current)
		}

		document.body.style.cursor = 'ew-resize'
		document.body.style.userSelect = 'none'
		window.addEventListener('mousemove', onMove)
		window.addEventListener('mouseup', onUp)
		return () => {
			document.body.style.cursor = ''
			document.body.style.userSelect = ''
			window.removeEventListener('mousemove', onMove)
			window.removeEventListener('mouseup', onUp)
		}
	}, [dragging])

	return (
		<aside ref={ref} className={styles.root} style={{ width: `${width}px` }}>
			<div className={styles.body}>{children}</div>
			<div
				className={dragging ? `${styles.handle} ${styles.dragging}` : styles.handle}
				onMouseDown={() => setDragging(true)}
			/>
		</aside>
	)
}

export default Sidebar
