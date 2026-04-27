import electron from 'electron'

electron.contextBridge.exposeInMainWorld('electron', {
	subscribeTestEvent: (callback) =>
		ipcOn('test', (stats) => {
			callback(stats)
		}),
	getFoldersData: () => ipcInvoke('getFoldersData', undefined)
} satisfies Window['electron'])

function ipcInvoke<Key extends keyof IpcInvokeMapping>(
	key: Key,
	args: IpcInvokeMapping[Key]['args']
): Promise<IpcInvokeMapping[Key]['result']> {
	return electron.ipcRenderer.invoke(key, args)
}

function ipcOn<Key extends keyof IpcEventMapping>(
	key: Key,
	callback: (payload: IpcEventMapping[Key]) => void
) {
	const cb = (_: Electron.IpcRendererEvent, payload: any) => callback(payload)
	electron.ipcRenderer.on(key, cb)
	return () => electron.ipcRenderer.off(key, cb)
}
