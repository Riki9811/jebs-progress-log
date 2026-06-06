import { useMemo, useState, type ReactNode } from 'react'
import { ErrorContext } from './ErrorContext'

function ErrorProvider({ children }: { children: ReactNode }) {
	const [message, setError] = useState('')

	const value = useMemo(() => ({ message, setError }), [message])

	return <ErrorContext.Provider value={value}>{children}</ErrorContext.Provider>
}

export default ErrorProvider
