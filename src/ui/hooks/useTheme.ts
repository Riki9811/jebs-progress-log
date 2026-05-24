import { useEffect, useState, useSyncExternalStore } from 'react'

type ResolvedTheme = 'dark' | 'light'

function subscribeToSystemTheme(onChange: () => void) {
	const mq = window.matchMedia('(prefers-color-scheme: dark)')
	mq.addEventListener('change', onChange)
	return () => mq.removeEventListener('change', onChange)
}

function getSystemTheme(): ResolvedTheme {
	return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export function useTheme() {
	const [theme, setThemeState] = useState<Preferences['theme']>(() => window.bootTheme ?? 'system')
	const systemTheme = useSyncExternalStore(subscribeToSystemTheme, getSystemTheme)
	const resolvedTheme: ResolvedTheme = theme === 'system' ? systemTheme : theme

	useEffect(() => {
		document.body.classList.toggle('lightTheme', resolvedTheme === 'light')
	}, [resolvedTheme])

	const setTheme = (next: Preferences['theme']) => {
		setThemeState(next)
		window.electron.setPreference({ theme: next })
	}

	return { theme, resolvedTheme, setTheme }
}
