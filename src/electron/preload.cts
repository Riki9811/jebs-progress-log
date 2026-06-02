import electron from 'electron'

const raw = ipcInvokeSync('getBootTheme', undefined)
const bootTheme: Preferences['theme'] | null =
	raw === 'system' || raw === 'dark' || raw === 'light' ? raw : null

electron.contextBridge.exposeInMainWorld('bootTheme', bootTheme)

electron.contextBridge.exposeInMainWorld('electron', {
	getSaveFolders: () => ipcInvoke('getSaveFolders', undefined),
	getReferenceData: () => ipcInvoke('getReferenceData', undefined),
	listSavesInFolder: (folderName) => ipcInvoke('listSavesInFolder', folderName),
	parseFullSave: (savePath) => ipcInvoke('parseFullSave', savePath),
	getPreferences: () => ipcInvoke('getPreferences', undefined),
	setPreference: (patch) => ipcInvoke('setPreference', patch),
	subscribeSelectedSaveChanged: (callback) => ipcOn('selectedSaveChanged', callback)
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
