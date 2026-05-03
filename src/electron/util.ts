import { ipcMain, WebFrameMain } from 'electron'
import { pathToFileURL } from 'url'
import { getUIPath } from './pathResolver.js'
import { err } from './result.js'

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
		try {
			validateEventFrame(event.senderFrame)
		} catch {
			return err({ type: 'EVENT_FRAME_ERROR' as const }) as IpcInvokeMapping[Key]['result']
		}
		return await handler(args)
	})
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
