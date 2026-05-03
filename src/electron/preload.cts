import electron from 'electron'

electron.contextBridge.exposeInMainWorld('electron', {
	getFoldersData: () => ipcInvoke('getFoldersData', undefined),
	getReferenceData: () => ipcInvoke('getReferenceData', undefined),
	listSavesInFolder: (folderName) => ipcInvoke('listSavesInFolder', folderName),
	parseFullSave: (savePath) => ipcInvoke('parseFullSave', savePath)
} satisfies Window['electron'])

function ipcInvoke<Key extends keyof IpcInvokeMapping>(
	key: Key,
	args: IpcInvokeMapping[Key]['args']
): Promise<IpcInvokeMapping[Key]['result']> {
	return electron.ipcRenderer.invoke(key, args)
}
