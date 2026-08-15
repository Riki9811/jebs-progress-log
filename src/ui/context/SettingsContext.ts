import { createContext } from 'react'

export type SettingsContextValue = {
	settings: Preferences
	// Applies a preference patch locally and persists it.
	update: (patch: Partial<Preferences>) => void
}

export const SettingsContext = createContext<SettingsContextValue | null>(null)
