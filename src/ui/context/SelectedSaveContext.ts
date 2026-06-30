import { createContext } from 'react'

// Full per-save data load. `idle` when nothing is selected; otherwise the parse
// of the selected save, keyed internally on its path so re-opening the same
// save never refetches.
export type SaveDataLoad =
	| { status: 'idle' }
	| { status: 'loading' }
	| { status: 'loaded'; value: SaveData }
	| { status: 'error' }

// Read side: the selected save's summary (available instantly on click), its
// full data (async), the static reference set, and which sidebar panel is shown.
export type SelectedSaveState = {
	reference: ReferenceData | null
	selected: SaveSummary | null
	data: SaveDataLoad
	view: 'explorer' | 'detail'
}

// Write side: stable for the lifetime of the provider, so leaf list rows can
// trigger selection without re-rendering on every state change.
export type SelectedSaveActions = {
	select: (summary: SaveSummary) => void
	back: () => void
}

export const SelectedSaveStateContext = createContext<SelectedSaveState | null>(null)
export const SelectedSaveActionsContext = createContext<SelectedSaveActions | null>(null)
