import { useContext } from 'react'
import { ErrorContext } from '../context/ErrorContext'

export function useError() {
	const ctx = useContext(ErrorContext)
	if (!ctx) throw new Error('useError must be used within an ErrorProvider')
	return ctx
}
