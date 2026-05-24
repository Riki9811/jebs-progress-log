import Store from 'electron-store'
import { ok } from './result.js'

const store = new Store<Preferences>({
	defaults: { theme: 'system' }
})

export function getBootTheme(): Preferences['theme'] {
	return store.get('theme')
}

export function getPreferences(): MainResult<'getPreferences'> {
	return ok(store.store)
}

export function setPreference(patch: Partial<Preferences>): MainResult<'setPreference'> {
	for (const [key, value] of Object.entries(patch)) {
		store.set(key as keyof Preferences, value as Preferences[keyof Preferences])
	}
	return ok(undefined)
}
