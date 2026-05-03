import { promises as fsp, constants as fsConstants, type Dirent } from 'fs'
import path from 'path'
import { ok, err } from './result.js'
import { extractSaveData } from './saveModel/extractSaveData.js'
import { KSP_INSTALL_DIR } from './pathResolver.js'

const UNWANTED_FOLDERS = ['training', 'scenarios', 'missions']
const SAVES_ROOT = path.resolve(KSP_INSTALL_DIR, 'saves')

// LRU semplice. Ogni `get` rinfresca la chiave portandola in fondo all'ordine
// di inserzione della Map; quando la dimensione eccede `max`, rimuoviamo la più vecchia.
class LruCache<K, V> {
	private map = new Map<K, V>()
	constructor(private max: number) {}
	get(key: K): V | undefined {
		const v = this.map.get(key)
		if (v !== undefined) {
			this.map.delete(key)
			this.map.set(key, v)
		}
		return v
	}
	set(key: K, value: V): void {
		if (this.map.has(key)) this.map.delete(key)
		this.map.set(key, value)
		if (this.map.size > this.max) {
			const oldest = this.map.keys().next().value
			if (oldest !== undefined) this.map.delete(oldest)
		}
	}
}

const cache = new LruCache<string, { mtimeMs: number; data: SaveData }>(16)

// Path traversal guard: il caller deve aver passato un path dentro SAVES_ROOT.
function isInsideSavesRoot(p: string): boolean {
	const resolved = path.resolve(p)
	if (resolved === SAVES_ROOT) return true
	const rel = path.relative(SAVES_ROOT, resolved)
	return rel !== '' && !rel.startsWith('..') && !path.isAbsolute(rel)
}

async function readKspFolder(folderPath: string): Promise<Result<Dirent[], FolderReadError>> {
	let stat
	try {
		stat = await fsp.stat(folderPath)
	} catch (e) {
		const code = (e as NodeJS.ErrnoException).code
		if (code === 'ENOENT') return err({ type: 'NOT_EXISTS' })
		return err({ type: 'CANNOT_READ' })
	}
	if (!stat.isDirectory()) return err({ type: 'NOT_FOLDER' })
	try {
		await fsp.access(folderPath, fsConstants.R_OK)
	} catch {
		return err({ type: 'CANNOT_READ' })
	}
	try {
		const entries = await fsp.readdir(folderPath, { withFileTypes: true })
		return ok(entries)
	} catch {
		return err({ type: 'CANNOT_READ' })
	}
}

export async function getFolders(): Promise<Result<string[], FolderReadError>> {
	const r = await readKspFolder(SAVES_ROOT)
	if (!r.ok) return r
	const folders = r.value
		.filter((it) => it.isDirectory() && !UNWANTED_FOLDERS.includes(it.name))
		.map((it) => path.join(SAVES_ROOT, it.name))
	return ok(folders)
}

export async function listSavesInFolder(
	folderPath: string
): Promise<Result<ListSavesResult, FolderReadError>> {
	if (!isInsideSavesRoot(folderPath)) return err({ type: 'CANNOT_READ' })
	const r = await readKspFolder(folderPath)
	if (!r.ok) return r

	const summaries: SaveSummary[] = []
	const errors: { fileName: string; error: ParseError }[] = []
	for (const e of r.value) {
		if (!e.isFile() || !e.name.endsWith('.sfs')) continue
		const filePath = path.join(folderPath, e.name)
		const result = await parseFullSave(filePath)
		if (result.ok) summaries.push(toSummary(result.value))
		else errors.push({ fileName: e.name, error: result.error })
	}
	return ok({ summaries, errors })
}

export async function parseFullSave(savePath: string): Promise<Result<SaveData, ParseError>> {
	if (!isInsideSavesRoot(savePath)) {
		return err({ type: 'IO_ERROR', reason: 'path outside saves root' })
	}

	let stats
	try {
		stats = await fsp.stat(savePath)
	} catch (e) {
		const code = (e as NodeJS.ErrnoException).code
		if (code === 'ENOENT') return err({ type: 'FILE_NOT_FOUND' })
		return err({ type: 'IO_ERROR', reason: String(e) })
	}

	const cached = cache.get(savePath)
	if (cached && cached.mtimeMs === stats.mtimeMs) {
		return ok(cached.data)
	}

	let content: string
	try {
		content = await fsp.readFile(savePath, 'utf-8')
	} catch (e) {
		return err({ type: 'IO_ERROR', reason: String(e) })
	}

	const result = extractSaveData(content, savePath)
	if (!result.ok) {
		if (result.error.type === 'PARSE') {
			return err({
				type: 'INVALID_FORMAT',
				line: result.error.line,
				reason: result.error.reason
			})
		}
		return err({ type: 'INVALID_FORMAT', line: 0, reason: 'no GAME block' })
	}

	cache.set(savePath, { mtimeMs: stats.mtimeMs, data: result.value })
	return ok(result.value)
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
