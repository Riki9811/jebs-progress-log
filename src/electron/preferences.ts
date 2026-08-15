import Store from 'electron-store'
import { ok } from './result.js'

const store = new Store<Preferences>({
	defaults: { theme: 'system', sidebarVisible: true, sidebarWidth: 260, tableFit: 'scroll' }
})

// Read synchronously: the renderer applies these before first paint, so no
// default theme/sidebar/layout ever flashes.
export function getBootPreferences(): Preferences {
	return store.store
}

export function getPreferences(): MainResult<'getPreferences'> {
	return ok(store.store)
}

export function getSettingsDebugInfo(): DebugSettings {
	return { ...store.store, path: store.path }
}

// Fires on every persisted change regardless of origin: store.set is the single
// funnel for all writes.
export function subscribeSettingsDebug(listener: () => void): void {
	store.onDidAnyChange(listener)
}

export function setPreference(patch: Partial<Preferences>): MainResult<'setPreference'> {
	for (const [key, value] of Object.entries(patch)) {
		store.set(key as keyof Preferences, value as Preferences[keyof Preferences])
	}
	return ok(undefined)
}
