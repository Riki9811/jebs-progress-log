import type { BrowserWindow } from 'electron'
import { getSettingsDebugInfo, subscribeSettingsDebug } from './preferences.js'
import { getCacheDebugInfo, setCacheDebugListener } from './savesManager.js'
import { ipcMainHandleDebug } from './util.js'

// Dev-only IPC surface. main.ts calls this exclusively under isDev(), so in a
// production build none of these channels are ever registered — an invoke from
// a compromised renderer would simply reject on a missing handler.
//
// Change notifications are bare pings ('settings' | 'cache'): the renderer
// re-fetches through the query channels and diffs against its own snapshot,
// keeping all presentation logic out of the main process.
export function registerDebugHandlers(win: BrowserWindow): void {
	ipcMainHandleDebug('debug:getSettings', getSettingsDebugInfo)
	ipcMainHandleDebug('debug:getCache', getCacheDebugInfo)

	const ping = (kind: DebugChangedKind) => {
		if (!win.isDestroyed()) win.webContents.send('debug:changed', kind)
	}
	subscribeSettingsDebug(() => ping('settings'))
	setCacheDebugListener(() => ping('cache'))
}
