import { useEffect, useState, useSyncExternalStore, type ReactNode } from 'react'
import { ThemeContext } from './ThemeContext'

type ResolvedTheme = 'dark' | 'light'

const MEDIA_QUERY = '(prefers-color-scheme: dark)'

function subscribeToSystemTheme(onChange: () => void) {
	const mq = window.matchMedia(MEDIA_QUERY)
	mq.addEventListener('change', onChange)
	return () => mq.removeEventListener('change', onChange)
}

function getSystemTheme(): ResolvedTheme {
	return window.matchMedia(MEDIA_QUERY).matches ? 'dark' : 'light'
}

function ThemeProvider({ children }: { children: ReactNode }) {
	const [theme, setThemeState] = useState<Preferences['theme']>(
		() => window.bootPreferences?.theme ?? 'system'
	)
	const systemTheme = useSyncExternalStore(subscribeToSystemTheme, getSystemTheme)
	const resolvedTheme: ResolvedTheme = theme === 'system' ? systemTheme : theme

	useEffect(() => {
		document.body.classList.toggle('lightTheme', resolvedTheme === 'light')
	}, [resolvedTheme])

	function setTheme(next: Preferences['theme']) {
		setThemeState(next)
		window.electron.setPreference({ theme: next })
	}

	return (
		<ThemeContext.Provider value={{ theme, resolvedTheme, setTheme }}>{children}</ThemeContext.Provider>
	)
}

export default ThemeProvider
