// =============================================================================
// IPC contract: single source of truth
// =============================================================================
//
// `Result<V, E>` is the generic result type for every outcome (ok/err).
// Three IPC channels, each with its own mapping:
//   - `IpcInvokeMapping`  renderer -> main, async request/response (invoke/handle)
//   - `IpcSyncMapping`    renderer -> main, synchronous request/response (sendSync)
//   - `IpcEventMapping`   main -> renderer, fire-and-forget push (send/on)
// `Window['electron']` derives the renderer-exposed API: invoke endpoints inline
// `FrameError` into their error branch, event endpoints become `subscribe*` methods.

type Result<V, E> = { ok: true; value: V } | { ok: false; error: E }

// --- IPC error types ---
// Each error is { code: '<CODE>'; ...optionalPayload }. Discriminated by `code`.

type FrameError = { code: 'EVENT_FRAME_ERROR' }

type FolderAccessError = { code: 'NOT_EXISTS' } | { code: 'NOT_FOLDER' } | { code: 'CANNOT_READ' }

type ParseFullSaveError =
	| { code: 'FILE_NOT_FOUND' }
	| { code: 'INVALID_FORMAT'; line: number; reason: string }
	| { code: 'IO_ERROR'; reason: string }

// --- Mappings ---

// Renderer -> Main, async request/response (ipcRenderer.invoke / ipcMain.handle)
type IpcInvokeMapping = {
	getSaveFolders: { args: void; value: SaveFolder[]; error: FolderAccessError }
	getReferenceData: { args: void; value: ReferenceData; error: never }
	listSavesInFolder: { args: string; value: ListSavesResult; error: FolderAccessError }
	parseFullSave: { args: string; value: SaveData; error: ParseFullSaveError }
	getPreferences: { args: void; value: Preferences; error: never }
	setPreference: { args: Partial<Preferences>; value: void; error: never }
}

// Renderer -> Main, synchronous request/response (ipcRenderer.sendSync / ipcMain.on).
// Reserved for the few reads that must resolve before first paint (no FOUC).
type IpcSyncMapping = {
	getBootPreferences: { args: void; value: Preferences }
}

// Main -> Renderer, fire-and-forget push (webContents.send / ipcRenderer.on).
// settingsChanged fires when a preference is toggled from the app menu (e.g. the
// sidebar or table-fit menu items), carrying the patch to merge into the renderer.
type IpcEventMapping = {
	settingsChanged: Partial<Preferences>
}

// --- Dev-only debug channel ---
// Registered in main and exposed by the preload ONLY when NODE_ENV=dev; the
// renderer console API is additionally stripped from prod bundles by Vite
// (import.meta.env.DEV). None of these channels exist in a production build.

type DebugSettings = Preferences & { path: string }

type DebugCacheEntry = {
	path: string
	mtimeMs: number
	fileName: string
	folderName: string
	gameVersion: string
	mode: GameMode
	totalScience: number
	experimentCount: number
	records: number
	bodies: number
}

type DebugCache = { max: number; size: number; entries: DebugCacheEntry[] }

type IpcDebugMapping = {
	'debug:getSettings': DebugSettings
	'debug:getCache': DebugCache
}

// Payload of the dev-only `debug:changed` push: which store just mutated. The
// renderer then re-fetches and diffs against its own snapshot.
type DebugChangedKind = 'settings' | 'cache'

type MainResult<K extends keyof IpcInvokeMapping> = Result<
	IpcInvokeMapping[K]['value'],
	IpcInvokeMapping[K]['error']
>

type RendererResult<K extends keyof IpcInvokeMapping> = Result<
	IpcInvokeMapping[K]['value'],
	IpcInvokeMapping[K]['error'] | FrameError
>

type UnsubscribeFn = () => void

interface Window {
	electron: {
		[K in keyof IpcInvokeMapping]: IpcInvokeMapping[K]['args'] extends void
			? () => Promise<RendererResult<K>>
			: (args: IpcInvokeMapping[K]['args']) => Promise<RendererResult<K>>
	} & {
		[K in keyof IpcEventMapping as `subscribe${Capitalize<K>}`]: (
			callback: (payload: IpcEventMapping[K]) => void
		) => UnsubscribeFn
	}
	bootPreferences: Preferences
	// Dev-only raw bridge to the debug IPC channels; absent in production.
	electronDebug?: {
		getSettings: () => Promise<DebugSettings>
		getCache: () => Promise<DebugCache>
		onChanged: (callback: (kind: DebugChangedKind) => void) => UnsubscribeFn
	}
	// Dev-only console API installed by the renderer (see src/ui/debug/devConsole.ts).
	debug?: {
		settings: () => Promise<DebugSettings>
		cache: () => Promise<DebugCache>
		help: () => void
		// Toggles live change logging.
		listenSettingsEvents: boolean
		listenCacheEvents: boolean
	}
}

// #region Game data types

type GameMode = 'CAREER' | 'SCIENCE_SANDBOX' | 'SANDBOX'

// 6 in-flight situations — drive the activityTypes matrix in the UI tables
type StandardSituation =
	| 'SrfLanded'
	| 'SrfSplashed'
	| 'FlyingLow'
	| 'FlyingHigh'
	| 'InSpaceLow'
	| 'InSpaceHigh'

// 5 recovery situations — appear in save scienceIds but are routed to a separate channel
type RecoverySituation = 'Flew' | 'SubOrbited' | 'Orbited' | 'FlewBy' | 'Surfaced'

// Any value that can appear in a ScienceRecord id
type Situation = StandardSituation | RecoverySituation

// 'biome' | 'global' = per-biome cell / tall cell (full rowspan); null = slot not available
type ActivityType = 'biome' | 'global' | null

type Activity = {
	name: string // e.g. 'crewReport'
	displayName: string // e.g. 'Crew Report'
	requiresAtmosphere: boolean
}

type DeployedExperiment = {
	name: string // e.g. 'deployedSeismicSensor'
	displayName: string
	requiresAtmosphere: boolean
	requiresVacuum: boolean
}

type RocScience = { name: string; displayName: string }

type Recovery = {
	name: RecoverySituation
	displayName: string
}

type CelestialBody = {
	name: string
	displayName: string
	isLandable: boolean
	hasAtmosphere: boolean
	hasWater: boolean
	biomes: readonly string[]
	specialBiomes: readonly string[]
	recovery: readonly Recovery[]
	ROCScience: readonly RocScience[]
}

type SituationDef = {
	name: StandardSituation
	displayName: string
	requiresAtmosphere: boolean
	requiresWater: boolean
	requiresLanding: boolean
	activityTypes: Readonly<Record<string, ActivityType>>
}

type ReferenceData = {
	bodies: readonly CelestialBody[]
	activities: readonly Activity[]
	deployedExperiments: readonly DeployedExperiment[]
	situations: readonly SituationDef[]
	recoverySituations: readonly RecoverySituation[]
}

// A save folder discovered under <KSP>/saves: the folder name (= the save's
// display name in KSP) and its absolute path. Only folders containing at least
// a `persistent.sfs` are surfaced.
type SaveFolder = { name: string; path: string }

type SaveSummary = {
	path: string
	fileName: string
	folderName: string
	gameVersion: string
	mode: GameMode
	totalScience: number
	experimentCount: number
}

type ScienceRecord = {
	rawId: string
	experimentId: string
	body: string
	situation: Situation
	biome: string | null
	title: string
	collected: number // ex sci — science points already collected
	total: number // ex cap — maximum obtainable science points
}

// Leaf: aggregation (situation × biome × experiment)
type BiomeStats = {
	biome: string
	perExperiment: Record<string, ScienceRecord>
}

// A standard situation: per-biome experiments separated from "global" (no-biome) ones
type SituationStats = {
	situation: StandardSituation
	scienceCollected: number
	recordCount: number
	biomes: Record<string, BiomeStats>
	global: Record<string, ScienceRecord>
}

// Recovery: no biome, experiment → record only
type RecoveryStats = {
	recovery: RecoverySituation
	scienceCollected: number
	perExperiment: Record<string, ScienceRecord>
}

// The 3 channels per body
type BodyStats = {
	body: string
	scienceCollected: number
	scienceTotal: number
	experimentCount: number
	perSituation: Partial<Record<StandardSituation, SituationStats>>
	deployedPerSituation: Partial<Record<StandardSituation, SituationStats>>
	recoveries: Partial<Record<RecoverySituation, RecoveryStats>>
}

type SaveAggregations = {
	perBody: Record<string, BodyStats>
	totalScienceCollected: number
}

type SaveData = SaveSummary & {
	scienceRecords: ScienceRecord[]
	aggregations: SaveAggregations
}

type ListSavesResult = {
	summaries: SaveSummary[]
	errors: { fileName: string; error: ParseFullSaveError }[]
}

// #endregion

// 'scroll' = tables keep full content width and scroll horizontally; 'shrink' =
// columns compress to fit the available width, truncating text with ellipsis.
type TableFit = 'scroll' | 'shrink'

type Preferences = {
	theme: 'system' | 'dark' | 'light'
	sidebarVisible: boolean
	sidebarWidth: number
	tableFit: TableFit
}
