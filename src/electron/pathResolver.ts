import { app } from 'electron'
import path from 'path'
import { isDev } from './util.js'

export function getPreloadPath(): string {
	const baseDir = isDev() ? app.getAppPath() : path.dirname(app.getAppPath())
	return path.join(baseDir, 'dist-electron', 'preload.cjs')
}

export function getUIPath(): string {
	return path.join(app.getAppPath(), 'dist-react', 'index.html')
}

// Placeholder hard-coded: la detection automatica del KSP install dir è rimandata.
export const KSP_INSTALL_DIR = '[PATH_TO_KSP]'
