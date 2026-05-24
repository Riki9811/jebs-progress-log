import electron from 'electron'

electron.contextBridge.exposeInMainWorld('electron', {
	getSaveFolders: () => ipcInvoke('getSaveFolders', undefined),
	getReferenceData: () => ipcInvoke('getReferenceData', undefined),
	listSavesInFolder: (folderName) => ipcInvoke('listSavesInFolder', folderName),
	parseFullSave: (savePath) => ipcInvoke('parseFullSave', savePath)
} satisfies Window['electron'])

function ipcInvoke<Key extends keyof IpcInvokeMapping>(
	key: Key,
	args: IpcInvokeMapping[Key]['args']
): Promise<RendererResult<Key>> {
	return electron.ipcRenderer.invoke(key, args)
}
