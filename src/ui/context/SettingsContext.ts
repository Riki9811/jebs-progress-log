import { createContext } from 'react'

export type SettingsContextValue = {
	settings: Preferences
	// Update one or more preferences from the renderer: applied locally and persisted.
	update: (patch: Partial<Preferences>) => void
}

export const SettingsContext = createContext<SettingsContextValue | null>(null)
