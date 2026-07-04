import Store from 'electron-store'
import { ok } from './result.js'

const store = new Store<Preferences>({
	defaults: { theme: 'system', sidebarVisible: true, sidebarWidth: 260, tableFit: 'scroll' }
})

// The whole preference set, read synchronously so the renderer can apply it
// before first paint (no flash of default sidebar/theme/layout).
export function getBootPreferences(): Preferences {
	return store.store
}

export function getPreferences(): MainResult<'getPreferences'> {
	return ok(store.store)
}

// Dev-only introspection: the persisted store plus the path of its backing file.
export function getSettingsDebugInfo(): DebugSettings {
	return { ...store.store, path: store.path }
}

// Dev-only: fires on any persisted change, whatever the origin (renderer update
// or menu toggle) — store.set is the single funnel for all writes.
export function subscribeSettingsDebug(listener: () => void): void {
	store.onDidAnyChange(listener)
}

export function setPreference(patch: Partial<Preferences>): MainResult<'setPreference'> {
	for (const [key, value] of Object.entries(patch)) {
		store.set(key as keyof Preferences, value as Preferences[keyof Preferences])
	}
	return ok(undefined)
}
