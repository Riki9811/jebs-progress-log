import { promises as fsp, constants as fsConstants, watch, type Dirent, type FSWatcher } from 'fs'
import path from 'path'
import { ok, err } from './result.js'
import { extractSaveData } from './saveModel/extractSaveData.js'
import { KSP_INSTALL_DIR } from './pathResolver.js'
import { LruCache } from './lruCache.js'

const UNWANTED_FOLDERS = ['training', 'scenarios', 'missions']
const SAVES_ROOT = path.resolve(KSP_INSTALL_DIR, 'saves')

const cache = new LruCache<string, { mtimeMs: number; data: SaveData }>(16)

// Notified after any cache content change. parseFullSave is the only writer, and
// its set plus any eviction happen in the same call. Only wired up in dev.
let cacheDebugListener: (() => void) | null = null
export function setCacheDebugListener(listener: (() => void) | null): void {
	cacheDebugListener = listener
}

// Path traversal guard: the resolved path must be inside SAVES_ROOT.
function isInsideSavesRoot(p: string): boolean {
	const resolved = path.resolve(p)
	if (resolved === SAVES_ROOT) return true
	const rel = path.relative(SAVES_ROOT, resolved)
	return rel !== '' && !rel.startsWith('..') && !path.isAbsolute(rel)
}

async function readKspFolder(folderPath: string): Promise<Result<Dirent[], FolderAccessError>> {
	let stat
	try {
		stat = await fsp.stat(folderPath)
	} catch (e) {
		const code = (e as NodeJS.ErrnoException).code
		if (code === 'ENOENT') return err('NOT_EXISTS')
		return err('CANNOT_READ')
	}
	if (!stat.isDirectory()) return err('NOT_FOLDER')
	try {
		await fsp.access(folderPath, fsConstants.R_OK)
	} catch {
		return err('CANNOT_READ')
	}
	try {
		const entries = await fsp.readdir(folderPath, { withFileTypes: true })
		return ok(entries)
	} catch {
		return err('CANNOT_READ')
	}
}

export async function getSaveFolders(): Promise<Result<SaveFolder[], FolderAccessError>> {
	const r = await readKspFolder(SAVES_ROOT)
	if (!r.ok) return r
	const candidates = r.value
		.filter((it) => it.isDirectory() && !UNWANTED_FOLDERS.includes(it.name))
		.map((it) => ({ name: it.name, path: path.join(SAVES_ROOT, it.name) }))
	// Only folders containing persistent.sfs count as real saves.
	const checks = await Promise.all(
		candidates.map(async (c) => {
			try {
				await fsp.access(path.join(c.path, 'persistent.sfs'), fsConstants.R_OK)
				return c
			} catch {
				return null
			}
		})
	)
	return ok(checks.filter((c): c is SaveFolder => c !== null))
}

export async function listSavesInFolder(
	folderPath: string
): Promise<Result<ListSavesResult, FolderAccessError>> {
	if (!isInsideSavesRoot(folderPath)) return err('CANNOT_READ')
	const r = await readKspFolder(folderPath)
	if (!r.ok) return r

	const summaries: SaveSummary[] = []
	const errors: { fileName: string; error: ParseFullSaveError }[] = []
	// REMIND: this parses each .sfs sequentially. If unfold latency on large saves
	// becomes noticeable, parallelize this loop with Promise.all like getSaveFolders.
	for (const e of r.value) {
		if (!e.isFile() || !e.name.endsWith('.sfs')) continue
		const filePath = path.join(folderPath, e.name)
		const result = await parseFullSave(filePath)
		if (result.ok) summaries.push(toSummary(result.value))
		else errors.push({ fileName: e.name, error: result.error })
	}
	return ok({ summaries, errors })
}

export async function parseFullSave(savePath: string): Promise<Result<SaveData, ParseFullSaveError>> {
	if (!isInsideSavesRoot(savePath)) {
		return err('IO_ERROR', { reason: 'path outside saves root' })
	}

	let stats
	try {
		stats = await fsp.stat(savePath)
	} catch (e) {
		const code = (e as NodeJS.ErrnoException).code
		if (code === 'ENOENT') return err('FILE_NOT_FOUND')
		return err('IO_ERROR', { reason: String(e) })
	}

	const cached = cache.get(savePath)
	if (cached && cached.mtimeMs === stats.mtimeMs) {
		return ok(cached.data)
	}

	let content: string
	try {
		content = await fsp.readFile(savePath, 'utf-8')
	} catch (e) {
		return err('IO_ERROR', { reason: String(e) })
	}

	const result = extractSaveData(content, savePath)
	if (!result.ok) {
		if (result.error.code === 'PARSE') {
			return err('INVALID_FORMAT', {
				line: result.error.line,
				reason: result.error.reason
			})
		}
		return err('INVALID_FORMAT', { line: 0, reason: 'no GAME block' })
	}

	cache.set(savePath, { mtimeMs: stats.mtimeMs, data: result.value })
	cacheDebugListener?.()
	return ok(result.value)
}

export function watchSaveFile(filePath: string, onChange: () => void, debounceMs = 1000): () => void {
	const dir = path.dirname(filePath)
	const fileName = path.basename(filePath)
	let watcher: FSWatcher | null = null
	let timer: NodeJS.Timeout | null = null

	function schedule(_event: string, changed: string | null) {
		if (changed !== null && changed !== fileName) return
		if (timer) clearTimeout(timer)
		timer = setTimeout(onChange, debounceMs)
	}

	// Security boundary: check that `dir` is inside the saves tree.
	if (isInsideSavesRoot(dir)) {
		try {
			watcher = watch(dir, schedule)
		} catch {
			// Directory missing or unreadable: nothing to watch.
		}
	}

	return () => {
		if (timer) clearTimeout(timer)
		watcher?.close()
	}
}

// Summarizes each cached save through the cache's read-only accessors, leaving
// LRU order untouched.
export function getCacheDebugInfo(): DebugCache {
	return {
		max: cache.capacity,
		size: cache.size,
		entries: cache.entries().map(([savePath, { mtimeMs, data }]) => ({
			path: savePath,
			mtimeMs,
			fileName: data.fileName,
			folderName: data.folderName,
			gameVersion: data.gameVersion,
			mode: data.mode,
			totalScience: data.totalScience,
			experimentCount: data.experimentCount,
			records: data.scienceRecords.length,
			bodies: Object.keys(data.aggregations.perBody).length
		}))
	}
}

function toSummary(data: SaveData): SaveSummary {
	return {
		path: data.path,
		fileName: data.fileName,
		folderName: data.folderName,
		gameVersion: data.gameVersion,
		mode: data.mode,
		totalScience: data.totalScience,
		experimentCount: data.experimentCount
	}
}
