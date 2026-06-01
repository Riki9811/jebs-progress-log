import { createContext } from 'react'

export type ThemeContextValue = {
	theme: Preferences['theme']
	resolvedTheme: 'dark' | 'light'
	setTheme: (next: Preferences['theme']) => void
}

export const ThemeContext = createContext<ThemeContextValue | null>(null)
