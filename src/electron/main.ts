import { app, BrowserWindow } from 'electron'
import { getPreloadPath, getUIPath } from './pathResolver.js'
import { getBootPreferences, getPreferences, setPreference } from './preferences.js'
import { getReferenceData } from './reference/index.js'
import { getSaveFolders, listSavesInFolder, parseFullSave } from './savesManager.js'
import { buildAppMenu } from './menu.js'
import { registerDebugHandlers } from './debug.js'
import { ipcMainHandle, ipcMainHandleSync, isDev } from './util.js'

app.on('ready', () => {
	const mainWindow = new BrowserWindow({
		webPreferences: {
			preload: getPreloadPath(),
			devTools: isDev(),
			contextIsolation: true,
			nodeIntegration: false,
			sandbox: true
		},
		width: 1280,
		height: 720
	})

	if (isDev()) {
		mainWindow.loadURL('http://localhost:5123')
		mainWindow.webContents.openDevTools()
	} else {
		mainWindow.loadFile(getUIPath())
	}

	buildAppMenu(mainWindow)

	ipcMainHandle('getSaveFolders', () => getSaveFolders())
	ipcMainHandle('getReferenceData', () => getReferenceData())
	ipcMainHandle('listSavesInFolder', (folderPath) => listSavesInFolder(folderPath))
	ipcMainHandle('parseFullSave', (savePath) => parseFullSave(savePath))
	ipcMainHandle('getPreferences', () => getPreferences())
	ipcMainHandle('setPreference', (patch) => setPreference(patch))
	ipcMainHandleSync('getBootPreferences', () => getBootPreferences())

	if (isDev()) registerDebugHandlers(mainWindow)
})
