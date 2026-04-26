import { BrowserWindow } from 'electron'
import fs, { Dirent } from 'fs'
import path from 'path'
import { ipcWebContentsSend } from './util.js'

const KSP_INSTALL_DIR: string = path.normalize(
	'C:\\Program Files (x86)\\Steam\\steamapps\\common\\Kerbal Space Program'
)

const UNWANTED_FOLDERS = ['training', 'scenarios', 'missions']

export function getFolders(): FolderReadResponse {
	const savesPath: string = path.join(KSP_INSTALL_DIR, 'saves')

	// 1. Check path is vaild and exists
	if (!fs.existsSync(savesPath)) return 'NOT_EXISTS'

	// 2. Check path is folder
	const stats: fs.Stats = fs.statSync(savesPath)
	if (!stats.isDirectory()) return 'NOT_FOLDER'

	// 3. Check read permission on folder
	try {
		fs.accessSync(savesPath, fs.constants.R_OK)
	} catch {
		return 'CANNOT_READ'
	}

	// Read contents of saves folder and return array of sub-folders found
	const items: Dirent<string>[] = fs.readdirSync(savesPath, { withFileTypes: true })

	return items
		.filter(
			(item: Dirent<string>): boolean => item.isDirectory() && !UNWANTED_FOLDERS.includes(item.name)
		)
		.map((item: Dirent<string>): string => path.join(item.parentPath, item.name))
}

export function testEvent(mainWindow: BrowserWindow) {
	setInterval(() => {
		ipcWebContentsSend('test', mainWindow.webContents, 'This is a test string')
	}, 1000)
}
