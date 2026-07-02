import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { SettingsContext } from './SettingsContext'

// Mirrors the store defaults; only used if the preload global is somehow absent.
const DEFAULTS: Preferences = {
	theme: 'system',
	sidebarVisible: true,
	sidebarWidth: 260,
	tableFit: 'scroll'
}

function SettingsProvider({ children }: { children: ReactNode }) {
	// Seeded synchronously from the boot preferences the preload injected — no flash.
	const [settings, setSettings] = useState<Preferences>(() => window.bootPreferences ?? DEFAULTS)

	// Menu-driven toggles arrive from main already persisted; just merge them in.
	useEffect(() => {
		return window.electron.subscribeSettingsChanged((patch) => {
			setSettings((prev) => ({ ...prev, ...patch }))
		})
	}, [])

	// Renderer-originated changes (e.g. resizing the sidebar): update and persist.
	const update = useCallback((patch: Partial<Preferences>) => {
		setSettings((prev) => ({ ...prev, ...patch }))
		window.electron.setPreference(patch)
	}, [])

	const value = useMemo(() => ({ settings, update }), [settings, update])

	return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>
}

export default SettingsProvider
