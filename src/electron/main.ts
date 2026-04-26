import { app, BrowserWindow } from 'electron'
import { ipcMainHandle, isDev } from './util.js'
import { getPreloadPath, getUIPath } from './pathResolver.js'
import { getFolders, testEvent } from './savesManager.js'

app.on('ready', () => {
	const mainWindow = new BrowserWindow({
		webPreferences: {
			preload: getPreloadPath(),
			devTools: isDev()
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

	testEvent(mainWindow)

	ipcMainHandle('getFoldersData', () => {
		return getFolders()
	})
})
