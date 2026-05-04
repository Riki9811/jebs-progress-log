import { ipcMain, WebFrameMain } from 'electron'
import { pathToFileURL } from 'url'
import { getUIPath } from './pathResolver.js'
import { ok, err } from './result.js'

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
		const frameCheck = validateEventFrame(event.senderFrame)
		if (!frameCheck.ok) return frameCheck
		return await handler(args)
	})
}

function validateEventFrame(frame: WebFrameMain | null): Result<void, EventFrameError> {
	if (!frame) return err({ type: 'EVENT_FRAME_ERROR' })
	if (isDev() && new URL(frame.url).host === 'localhost:5123') return ok(undefined)
	const expected = pathToFileURL(getUIPath()).toString()
	if (decodeURIComponent(frame.url) !== decodeURIComponent(expected)) {
		return err({ type: 'EVENT_FRAME_ERROR' })
	}
	return ok(undefined)
}
