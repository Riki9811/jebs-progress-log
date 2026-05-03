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

// === KSP install dir ===
// Per ora hardcoded a placeholder. La detection automatica sarà ripresa dopo
// (problemi noti: fallback fittizio, no path custom, esecuzione a init-time).
export const KSP_INSTALL_DIR = '[PATH_TO_KSP]'

/*
import os from 'os'
import fs from 'fs'

function kspCandidates(): string[] {
	const home = os.homedir()
	if (process.platform === 'darwin') return [
		path.join(home, 'Library/Application Support/Steam/steamapps/common/Kerbal Space Program'),
		path.join(home, 'Applications/Kerbal Space Program')
	]
	if (process.platform === 'win32') return [
		path.join('C:\\', 'Program Files (x86)', 'Steam', 'steamapps', 'common', 'Kerbal Space Program'),
		path.join('C:\\', 'Kerbal Space Program')
	]
	return [
		path.join(home, '.local/share/Steam/steamapps/common/Kerbal Space Program'),
		path.join(home, 'Kerbal Space Program')
	]
}

export function detectKspInstallDir(): Result<string, 'NOT_FOUND'> {
	const found = kspCandidates().find((p) => fs.existsSync(p))
	return found ? { ok: true, value: found } : { ok: false, error: 'NOT_FOUND' }
}
*/
