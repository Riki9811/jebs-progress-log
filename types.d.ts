// =============================================================================
// IPC contract: single source of truth
// =============================================================================
//
// `Result<V, E>` is the generic result type for every outcome (ok/err).
// `IpcInvokeMapping` defines per-endpoint args/value/error types (domain errors
// from the main-process perspective).
// `Window['electron']` derives the renderer-exposed API, inlining `FrameError`
// into the error branch of each endpoint.

type Result<V, E> = { ok: true; value: V } | { ok: false; error: E }

// --- IPC error types ---
// Each error is { code: '<CODE>'; ...optionalPayload }. Discriminated by `code`.

type FrameError = { code: 'EVENT_FRAME_ERROR' }

type FolderAccessError = { code: 'NOT_EXISTS' } | { code: 'NOT_FOLDER' } | { code: 'CANNOT_READ' }

type ParseFullSaveError =
	| { code: 'FILE_NOT_FOUND' }
	| { code: 'INVALID_FORMAT'; line: number; reason: string }
	| { code: 'IO_ERROR'; reason: string }

// --- Mapping ---

type IpcInvokeMapping = {
	getSaveFolders: { args: void; value: SaveFolder[]; error: FolderAccessError }
	getReferenceData: { args: void; value: ReferenceData; error: never }
	listSavesInFolder: { args: string; value: ListSavesResult; error: FolderAccessError }
	parseFullSave: { args: string; value: SaveData; error: ParseFullSaveError }
}

type MainResult<K extends keyof IpcInvokeMapping> = Result<
	IpcInvokeMapping[K]['value'],
	IpcInvokeMapping[K]['error']
>

type RendererResult<K extends keyof IpcInvokeMapping> = Result<
	IpcInvokeMapping[K]['value'],
	IpcInvokeMapping[K]['error'] | FrameError
>

interface Window {
	electron: {
		[K in keyof IpcInvokeMapping]: IpcInvokeMapping[K]['args'] extends void
			? () => Promise<RendererResult<K>>
			: (args: IpcInvokeMapping[K]['args']) => Promise<RendererResult<K>>
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
