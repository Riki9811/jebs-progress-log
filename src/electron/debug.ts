import type { BrowserWindow } from 'electron'
import { getSettingsDebugInfo, subscribeSettingsDebug } from './preferences.js'
import { getCacheDebugInfo, setCacheDebugListener } from './savesManager.js'
import { ipcMainHandleDebug } from './util.js'

// Dev-only IPC surface: main registers these channels only under isDev(), so they
// do not exist in a production build.
//
// Change notifications carry only the kind that mutated; the renderer re-fetches
// and diffs, which keeps presentation logic out of the main process.
export function registerDebugHandlers(win: BrowserWindow): void {
	ipcMainHandleDebug('debug:getSettings', getSettingsDebugInfo)
	ipcMainHandleDebug('debug:getCache', getCacheDebugInfo)

	const ping = (kind: DebugChangedKind) => {
		if (!win.isDestroyed()) win.webContents.send('debug:changed', kind)
	}
	subscribeSettingsDebug(() => ping('settings'))
	setCacheDebugListener(() => ping('cache'))
}
