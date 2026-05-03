import { app, BrowserWindow } from 'electron'
import { ipcMainHandle, isDev } from './util.js'
import { getPreloadPath, getUIPath } from './pathResolver.js'
import { getFolders, listSavesInFolder, parseFullSave } from './savesManager.js'
import { getReferenceData } from './reference/index.js'

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

	ipcMainHandle('getFoldersData', () => getFolders())
	ipcMainHandle('getReferenceData', () => ({ ok: true, value: getReferenceData() }))
	ipcMainHandle('listSavesInFolder', (folderPath) => listSavesInFolder(folderPath))
	ipcMainHandle('parseFullSave', (savePath) => parseFullSave(savePath))
})
