import { useContext } from 'react'
import { SelectedSaveStateContext } from '../context/SelectedSaveContext'

export function useSaveState() {
	const ctx = useContext(SelectedSaveStateContext)
	if (!ctx) throw new Error('useSaveState must be used within a SelectedSaveProvider')
	return ctx
}
