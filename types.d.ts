type Result<T, E> = { ok: true; value: T } | { ok: false; error: E }

type FolderReadError = 'NOT_EXISTS' | 'NOT_FOLDER' | 'CANNOT_READ' | 'UNKNOWN_ERROR'

type UnsubscribeFunction = () => void

interface Window {
	electron: {
		subscribeTestEvent: (callback: (testData: string) => void) => UnsubscribeFunction
		getFoldersData: () => Promise<Result<string[], FolderReadError>>
	}
}

// Renderer → Main (request/response, ipcMain.handle / ipcRenderer.invoke)
type IpcInvokeMapping = {
	getFoldersData: {
		args: void
		result: Result<string[], FolderReadError>
	}
}

// Main → Renderer (fire-and-forget, webContents.send / ipcRenderer.on)
type IpcEventMapping = {
	test: string
}
