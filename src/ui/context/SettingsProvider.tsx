import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { SettingsContext } from './SettingsContext'

// Fallback for a missing preload global; mirrors the main-process store defaults.
const DEFAULTS: Preferences = {
	theme: 'system',
	sidebarVisible: true,
	sidebarWidth: 260,
	tableFit: 'scroll'
}

function SettingsProvider({ children }: { children: ReactNode }) {
	// Seeded synchronously from the preload's boot preferences, so nothing flashes.
	const [settings, setSettings] = useState<Preferences>(() => window.bootPreferences ?? DEFAULTS)

	// Menu toggles arrive from main already persisted, so they only need merging.
	useEffect(() => {
		return window.electron.subscribeSettingsChanged((patch) => {
			setSettings((prev) => ({ ...prev, ...patch }))
		})
	}, [])

	// Renderer-originated changes, e.g. a sidebar resize.
	const update = useCallback((patch: Partial<Preferences>) => {
		setSettings((prev) => ({ ...prev, ...patch }))
		window.electron.setPreference(patch)
	}, [])

	const value = useMemo(() => ({ settings, update }), [settings, update])

	return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>
}

export default SettingsProvider
