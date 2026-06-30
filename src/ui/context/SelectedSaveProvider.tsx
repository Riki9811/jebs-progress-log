import { useEffect, useMemo, useState, type ReactNode } from 'react'
import {
	SelectedSaveStateContext,
	SelectedSaveActionsContext,
	type SaveDataLoad
} from './SelectedSaveContext'
import { useError } from '../hooks/useError'

type Resolved = { status: 'loaded'; value: SaveData } | { status: 'error' }

// Footer gets the full diagnostic; the detail panel only shows a generic line.
function describe(error: ParseFullSaveError | FrameError): string {
	switch (error.code) {
		case 'INVALID_FORMAT':
			return `INVALID_FORMAT (line ${error.line}): ${error.reason}`
		case 'IO_ERROR':
			return `IO_ERROR: ${error.reason}`
		default:
			return error.code
	}
}

function SelectedSaveProvider({ children }: { children: ReactNode }) {
	const [reference, setReference] = useState<ReferenceData | null>(null)
	const [selected, setSelected] = useState<SaveSummary | null>(null)
	const [view, setView] = useState<'explorer' | 'detail'>('explorer')
	const [result, setResult] = useState<{ path: string; load: Resolved } | null>(null)
	const { setError } = useError()

	// Reference data is static: fetch once.
	useEffect(() => {
		let active = true
		window.electron.getReferenceData().then((res) => {
			if (active && res.ok) setReference(res.value)
		})
		return () => {
			active = false
		}
	}, [])

	// Full data for the current selection. The BE mtime-cache makes this near
	// instant for saves already listed; tagging by path drops stale responses
	// from rapid selection changes.
	useEffect(() => {
		if (!selected) return
		let active = true
		const { path, fileName } = selected
		window.electron.parseFullSave(path).then((res) => {
			if (!active) return
			if (res.ok) {
				setResult({ path, load: { status: 'loaded', value: res.value } })
			} else {
				setResult({ path, load: { status: 'error' } })
				setError(`${fileName}: ${describe(res.error)}`)
			}
		})
		return () => {
			active = false
		}
	}, [selected, setError])

	const data = useMemo<SaveDataLoad>(() => {
		if (!selected) return { status: 'idle' }
		return result?.path === selected.path ? result.load : { status: 'loading' }
	}, [selected, result])

	const state = useMemo(
		() => ({ reference, selected, data, view }),
		[reference, selected, data, view]
	)

	// Back leaves `selected` intact so the detail panel stays filled while it
	// slides out — only the active view changes.
	const actions = useMemo(
		() => ({
			select: (summary: SaveSummary) => {
				setSelected(summary)
				setView('detail')
			},
			back: () => setView('explorer')
		}),
		[]
	)

	return (
		<SelectedSaveActionsContext.Provider value={actions}>
			<SelectedSaveStateContext.Provider value={state}>{children}</SelectedSaveStateContext.Provider>
		</SelectedSaveActionsContext.Provider>
	)
}

export default SelectedSaveProvider
