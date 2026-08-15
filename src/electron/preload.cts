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

// Dev-only debug bridge, mirroring the handlers main registers under isDev().
// These channels sit outside IpcInvokeMapping so the production IPC contract
// stays untouched.
if (process.env.NODE_ENV === 'dev') {
	electron.contextBridge.exposeInMainWorld('electronDebug', {
		getSettings: () => electron.ipcRenderer.invoke('debug:getSettings'),
		getCache: () => electron.ipcRenderer.invoke('debug:getCache'),
		onChanged: (callback: (kind: DebugChangedKind) => void) => {
			const listener = (_: Electron.IpcRendererEvent, kind: DebugChangedKind) => callback(kind)
			electron.ipcRenderer.on('debug:changed', listener)
			return () => electron.ipcRenderer.off('debug:changed', listener)
		}
	} satisfies NonNullable<Window['electronDebug']>)
}

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
