import { ipcMain, WebContents, WebFrameMain } from 'electron'
import { pathToFileURL } from 'url'
import { getUIPath } from './pathResolver.js'

export function isDev(): boolean {
	return process.env.NODE_ENV === 'dev'
}

export function ipcMainHandle<Key extends keyof IpcInvokeMapping>(
	key: Key,
	handler: (
		args: IpcInvokeMapping[Key]['args']
	) => Promise<IpcInvokeMapping[Key]['result']> | IpcInvokeMapping[Key]['result']
) {
	ipcMain.handle(key, async (event, args: IpcInvokeMapping[Key]['args']) => {
		validateEventFrame(event.senderFrame)
		return await handler(args)
	})
}

export function ipcWebContentsSend<Key extends keyof IpcEventMapping>(
	key: Key,
	webContents: WebContents,
	payload: IpcEventMapping[Key]
) {
	webContents.send(key, payload)
}

export function validateEventFrame(frame: WebFrameMain | null) {
	if (!frame) {
		throw new Error('Unverified frame (null). Event rejected.')
	}

	if (isDev() && new URL(frame.url).host === 'localhost:5123') {
		return
	}

	const expected = pathToFileURL(getUIPath()).toString()

	if (decodeURIComponent(frame.url) !== decodeURIComponent(expected)) {
		throw new Error('Malicious event.')
	}
}
