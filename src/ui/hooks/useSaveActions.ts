import { useContext } from 'react'
import { SelectedSaveActionsContext } from '../context/SelectedSaveContext'

export function useSaveActions() {
	const ctx = useContext(SelectedSaveActionsContext)
	if (!ctx) throw new Error('useSaveActions must be used within a SelectedSaveProvider')
	return ctx
}
