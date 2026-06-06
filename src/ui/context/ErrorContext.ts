import { createContext } from 'react'

export type ErrorContextValue = {
	// The single most recent error message, or '' when none. Setting a new one
	// overwrites the previous; there is no accumulation across sources.
	message: string
	setError: (message: string) => void
}

export const ErrorContext = createContext<ErrorContextValue | null>(null)
