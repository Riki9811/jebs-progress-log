import electron from 'electron'

electron.contextBridge.exposeInMainWorld('bootPreferences', ipcInvokeSync('getBootPreferences', undefined))

electron.contextBridge.exposeInMainWorld('electron', {
	getSaveFolders: () => ipcInvoke('getSaveFolders', undefined),
	getReferenceData: () => ipcInvoke('getReferenceData', undefined),
	listSavesInFolder: (folderName) => ipcInvoke('listSavesInFolder', folderName),
	parseFullSave: (savePath) => ipcInvoke('parseFullSave', savePath),
	getPreferences: () => ipcInvoke('getPreferences', undefined),
	setPreference: (patch) => ipcInvoke('setPreference', patch),
	subscribeSettingsChanged: (callback) => ipcOn('settingsChanged', callback)
} satisfies Window['electron'])

function ipcInvoke<Key extends keyof IpcInvokeMapping>(
	key: Key,
	args: IpcInvokeMapping[Key]['args']
): Promise<RendererResult<Key>> {
	return electron.ipcRenderer.invoke(key, args)
}

function ipcInvokeSync<Key extends keyof IpcSyncMapping>(
	key: Key,
	args: IpcSyncMapping[Key]['args']
): IpcSyncMapping[Key]['value'] {
	return electron.ipcRenderer.sendSync(key, args)
}

function ipcOn<Key extends keyof IpcEventMapping>(
	key: Key,
	callback: (payload: IpcEventMapping[Key]) => void
): UnsubscribeFn {
	const listener = (_: Electron.IpcRendererEvent, payload: IpcEventMapping[Key]) => callback(payload)
	electron.ipcRenderer.on(key, listener)
	return () => electron.ipcRenderer.off(key, listener)
}
