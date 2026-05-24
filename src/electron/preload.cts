import electron from 'electron'

const themeArg = process.argv.find((a) => a.startsWith('--boot-theme='))
const raw = themeArg ? themeArg.slice('--boot-theme='.length) : null
const bootTheme: Preferences['theme'] | null =
	raw === 'system' || raw === 'dark' || raw === 'light' ? raw : null

electron.contextBridge.exposeInMainWorld('bootTheme', bootTheme)

electron.contextBridge.exposeInMainWorld('electron', {
	getSaveFolders: () => ipcInvoke('getSaveFolders', undefined),
	getReferenceData: () => ipcInvoke('getReferenceData', undefined),
	listSavesInFolder: (folderName) => ipcInvoke('listSavesInFolder', folderName),
	parseFullSave: (savePath) => ipcInvoke('parseFullSave', savePath),
	getPreferences: () => ipcInvoke('getPreferences', undefined),
	setPreference: (patch) => ipcInvoke('setPreference', patch)
} satisfies Window['electron'])

function ipcInvoke<Key extends keyof IpcInvokeMapping>(
	key: Key,
	args: IpcInvokeMapping[Key]['args']
): Promise<RendererResult<Key>> {
	return electron.ipcRenderer.invoke(key, args)
}
