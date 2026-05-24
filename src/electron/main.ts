import { app, BrowserWindow } from 'electron'
import { getPreloadPath, getUIPath } from './pathResolver.js'
import { getBootTheme, getPreferences, setPreference } from './preferences.js'
import { getReferenceData } from './reference/index.js'
import { getSaveFolders, listSavesInFolder, parseFullSave } from './savesManager.js'
import { ipcMainHandle, isDev } from './util.js'

app.on('ready', () => {
	const bootTheme = getBootTheme()

	const mainWindow = new BrowserWindow({
		webPreferences: {
			preload: getPreloadPath(),
			devTools: isDev(),
			contextIsolation: true,
			nodeIntegration: false,
			sandbox: true,
			additionalArguments: [`--boot-theme=${bootTheme}`]
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

	ipcMainHandle('getSaveFolders', () => getSaveFolders())
	ipcMainHandle('getReferenceData', () => getReferenceData())
	ipcMainHandle('listSavesInFolder', (folderPath) => listSavesInFolder(folderPath))
	ipcMainHandle('parseFullSave', (savePath) => parseFullSave(savePath))
	ipcMainHandle('getPreferences', () => getPreferences())
	ipcMainHandle('setPreference', (patch) => setPreference(patch))
})
