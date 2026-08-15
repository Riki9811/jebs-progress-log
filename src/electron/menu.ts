import { Menu, BrowserWindow, type MenuItemConstructorOptions } from 'electron'
import { getBootPreferences, setPreference } from './preferences.js'
import { ipcWebContentsSend, isDev } from './util.js'

// Persists a menu toggle and pushes it to the renderer so both stay in sync.
function apply(win: BrowserWindow, patch: Partial<Preferences>) {
	setPreference(patch)
	ipcWebContentsSend('settingsChanged', win.webContents, patch)
}

export function buildAppMenu(win: BrowserWindow): void {
	const prefs = getBootPreferences()
	const isMac = process.platform === 'darwin'

	const template: MenuItemConstructorOptions[] = [
		...((isMac ? [{ role: 'appMenu' }] : []) as MenuItemConstructorOptions[]),
		{ role: 'fileMenu' },
		{ role: 'editMenu' },
		{
			label: 'View',
			submenu: [
				{
					label: 'Toggle Sidebar',
					accelerator: 'CmdOrCtrl+B',
					type: 'checkbox',
					checked: prefs.sidebarVisible,
					click: (item) => apply(win, { sidebarVisible: item.checked })
				},
				{
					label: 'Fit Table to Width',
					accelerator: 'CmdOrCtrl+Shift+F',
					type: 'checkbox',
					checked: prefs.tableFit === 'shrink',
					click: (item) => apply(win, { tableFit: item.checked ? 'shrink' : 'scroll' })
				},
				{ type: 'separator' },
				...((isDev()
					? [{ role: 'reload' }, { role: 'toggleDevTools' }]
					: []) as MenuItemConstructorOptions[]),
				{ role: 'togglefullscreen' }
			]
		},
		{ role: 'windowMenu' }
	]

	Menu.setApplicationMenu(Menu.buildFromTemplate(template))
}
