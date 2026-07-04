import { ipcMain, WebContents, WebFrameMain } from 'electron'
import { pathToFileURL } from 'url'
import { getUIPath } from './pathResolver.js'
import { ok, err } from './result.js'

export function isDev(): boolean {
	return process.env.NODE_ENV === 'dev'
}

export function ipcMainHandle<Key extends keyof IpcInvokeMapping>(
	key: Key,
	handler: (args: IpcInvokeMapping[Key]['args']) => Promise<MainResult<Key>> | MainResult<Key>
) {
	ipcMain.handle(key, async (event, args: IpcInvokeMapping[Key]['args']) => {
		const frameCheck = validateEventFrame(event.senderFrame)
		if (!frameCheck.ok) return frameCheck
		return await handler(args)
	})
}

export function ipcMainHandleSync<Key extends keyof IpcSyncMapping>(
	key: Key,
	handler: (args: IpcSyncMapping[Key]['args']) => IpcSyncMapping[Key]['value']
) {
	ipcMain.on(key, (event, args: IpcSyncMapping[Key]['args']) => {
		const frameCheck = validateEventFrame(event.senderFrame)
		event.returnValue = frameCheck.ok ? handler(args) : null
	})
}

// Dev-only mirror of ipcMainHandle for the debug channels: same frame validation,
// but the payload is returned bare (no Result wrapper). Only called from debug.ts,
// which main registers exclusively under isDev() — these channels never exist in
// a production build.
export function ipcMainHandleDebug<Key extends keyof IpcDebugMapping>(
	key: Key,
	handler: () => IpcDebugMapping[Key]
) {
	ipcMain.handle(key, (event) => {
		const frameCheck = validateEventFrame(event.senderFrame)
		return frameCheck.ok ? handler() : null
	})
}

export function ipcWebContentsSend<Key extends keyof IpcEventMapping>(
	key: Key,
	webContents: WebContents,
	payload: IpcEventMapping[Key]
) {
	webContents.send(key, payload)
}

function validateEventFrame(frame: WebFrameMain | null): Result<void, FrameError> {
	if (!frame) return err('EVENT_FRAME_ERROR')
	if (isDev() && new URL(frame.url).host === 'localhost:5123') return ok(undefined)
	const expected = pathToFileURL(getUIPath()).toString()
	if (decodeURIComponent(frame.url) !== decodeURIComponent(expected)) {
		return err('EVENT_FRAME_ERROR')
	}
	return ok(undefined)
}
