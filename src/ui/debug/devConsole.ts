// Dev-only DevTools console API. Imported dynamically from main.tsx behind
// import.meta.env.DEV, so this module never reaches the production bundle. It
// talks to the main process through the dev-only electronDebug preload bridge;
// both sides of that bridge exist only when NODE_ENV=dev.
//
// Live events: main pushes a bare ping when settings or cache mutate; this
// module re-fetches the state, diffs it against its last snapshot and prints
// only the delta. Toggle with `debug.listenSettingsEvents = true` (and the
// cache twin). Manual debug.settings()/debug.cache() calls refresh the
// snapshot too, so the next diff is always against what you last saw.

type Prefs = Omit<DebugSettings, 'path'>

function printSettingsDiff(prev: DebugSettings, next: DebugSettings): void {
	const keys = (Object.keys(next) as (keyof DebugSettings)[]).filter(
		(k): k is keyof Prefs => k !== 'path'
	)
	const changed = keys.filter((k) => !Object.is(prev[k], next[k]))
	if (changed.length === 0) return

	const summary = changed.map((k) => `${k}: ${prev[k]} → ${next[k]}`).join(', ')
	console.log(`[debug] settings changed — ${summary}`)
	// Full table for context: changed rows carry the arrow, others the plain value.
	const table: Record<string, { value: string }> = {}
	for (const k of keys) {
		table[k] = { value: changed.includes(k) ? `${prev[k]} → ${next[k]}` : String(next[k]) }
	}
	console.table(table)
}

function printCacheDiff(prev: DebugCache, next: DebugCache): void {
	const prevByPath = new Map(prev.entries.map((e) => [e.path, e]))
	const nextByPath = new Map(next.entries.map((e) => [e.path, e]))

	type Row = { change: string; file: string; folder: string; sci: string; exp: string }
	const rows: Row[] = []
	for (const e of next.entries) {
		const p = prevByPath.get(e.path)
		if (!p) {
			rows.push({
				change: 'added',
				file: e.fileName,
				folder: e.folderName,
				sci: String(e.totalScience),
				exp: String(e.experimentCount)
			})
		} else if (p.mtimeMs !== e.mtimeMs) {
			rows.push({
				change: 'reparsed',
				file: e.fileName,
				folder: e.folderName,
				sci: p.totalScience === e.totalScience ? String(e.totalScience) : `${p.totalScience} → ${e.totalScience}`,
				exp:
					p.experimentCount === e.experimentCount
						? String(e.experimentCount)
						: `${p.experimentCount} → ${e.experimentCount}`
			})
		}
	}
	for (const e of prev.entries) {
		if (!nextByPath.has(e.path)) {
			rows.push({
				change: 'evicted',
				file: e.fileName,
				folder: e.folderName,
				sci: String(e.totalScience),
				exp: String(e.experimentCount)
			})
		}
	}
	// Content identical (e.g. only LRU order moved): stay quiet.
	if (rows.length === 0) return

	console.log(`[debug] cache changed — ${prev.size} → ${next.size}/${next.max} entries`)
	console.table(rows)
}

export function installDebugConsole(): void {
	const bridge = window.electronDebug
	if (!bridge) {
		console.warn('[debug] electronDebug bridge missing — debug tools unavailable')
		return
	}

	let listenSettings = false
	let listenCache = false
	let lastSettings: DebugSettings | null = null
	let lastCache: DebugCache | null = null

	bridge.onChanged(async (kind) => {
		if (kind === 'settings' && listenSettings) {
			const next = await bridge.getSettings()
			if (lastSettings) printSettingsDiff(lastSettings, next)
			lastSettings = next
		} else if (kind === 'cache' && listenCache) {
			const next = await bridge.getCache()
			if (lastCache) printCacheDiff(lastCache, next)
			lastCache = next
		}
	})

	window.debug = {
		async settings() {
			const s = await bridge.getSettings()
			lastSettings = s
			const { path, ...prefs } = s
			console.log(`[debug] preferences file: ${path}`)
			console.table(prefs)
			return s
		},
		async cache() {
			const c = await bridge.getCache()
			lastCache = c
			console.log(`[debug] save-parse cache: ${c.size}/${c.max} entries (least recent first)`)
			if (c.entries.length > 0) console.table(c.entries)
			return c
		},
		help() {
			console.log(
				'[debug] available commands:\n' +
					'  debug.settings()                 — persisted preferences + store file path\n' +
					'  debug.cache()                    — save-parse LRU cache summary\n' +
					'  debug.listenSettingsEvents = t/f — log settings changes live (diffed)\n' +
					'  debug.listenCacheEvents = t/f    — log cache changes live (diffed)\n' +
					'  debug.help()                     — this list'
			)
		},
		get listenSettingsEvents() {
			return listenSettings
		},
		set listenSettingsEvents(on: boolean) {
			listenSettings = on
			if (on) {
				// Seed the baseline so the first event diffs against current state.
				bridge.getSettings().then((s) => {
					lastSettings = s
				})
			}
			console.log(`[debug] settings events ${on ? 'ON' : 'OFF'}`)
		},
		get listenCacheEvents() {
			return listenCache
		},
		set listenCacheEvents(on: boolean) {
			listenCache = on
			if (on) {
				bridge.getCache().then((c) => {
					lastCache = c
				})
			}
			console.log(`[debug] cache events ${on ? 'ON' : 'OFF'}`)
		}
	}

	console.info('[debug] dev tools ready — try debug.help()')
}
