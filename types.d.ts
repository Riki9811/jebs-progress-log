// Result<T, E> vive in src/electron/result.ts insieme agli helper ok/err.
// Qui lo riferiamo via inline import per averlo disponibile come tipo globale
// senza trasformare questo file in un module.
type Result<T, E> = import('./src/electron/result.js').Result<T, E>

type FolderReadError =
	| { type: 'NOT_EXISTS' }
	| { type: 'NOT_FOLDER' }
	| { type: 'CANNOT_READ' }
	| { type: 'EVENT_FRAME_ERROR' }

type ParseError =
	| { type: 'FILE_NOT_FOUND' }
	| { type: 'INVALID_FORMAT'; line: number; reason: string }
	| { type: 'IO_ERROR'; reason: string }
	| { type: 'EVENT_FRAME_ERROR' }

// === Save / science domain types ===

type GameMode = 'CAREER' | 'SCIENCE_SANDBOX' | 'SANDBOX'

// 6 situazioni "in flight" — pilotano la matrice activityTypes nelle tabelle UI
type StandardSituation =
	| 'SrfLanded'
	| 'SrfSplashed'
	| 'FlyingLow'
	| 'FlyingHigh'
	| 'InSpaceLow'
	| 'InSpaceHigh'

// 5 situazioni di recovery — appaiono negli scienceId del save ma vanno in un canale separato
type RecoverySituation = 'Flew' | 'SubOrbited' | 'Orbited' | 'FlewBy' | 'Surfaced'

// Tutto ciò che può comparire nell'id di uno ScienceRecord
type Situation = StandardSituation | RecoverySituation

// 'biome' | 'global' = celle normali / cella tall (rowspan completo); null = casella non disponibile
type ActivityType = 'biome' | 'global' | null

type Activity = {
	name: string // es. 'crewReport'
	displayName: string // es. 'Crew Report'
	requiresAtmosphere: boolean
}

type DeployedExperiment = {
	name: string // es. 'deployedSeismicSensor'
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
	collected: number // ex sci — punti scienza già raccolti
	total: number // ex cap — punti scienza massimi ottenibili
}

// Foglia: aggregazione (situation × biome × experiment)
type BiomeStats = {
	biome: string
	perExperiment: Record<string, ScienceRecord>
}

// Una situation standard, opzione B: biomi normali separati dagli esperimenti "global" (no-biome)
type SituationStats = {
	situation: StandardSituation
	scienceCollected: number
	recordCount: number
	biomes: Record<string, BiomeStats>
	global: Record<string, ScienceRecord>
}

// Recovery: nessun biome, solo experiment → record
type RecoveryStats = {
	recovery: RecoverySituation
	scienceCollected: number
	perExperiment: Record<string, ScienceRecord>
}

// I 3 canali per body
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
	errors: { fileName: string; error: ParseError }[]
}

interface Window {
	electron: {
		getFoldersData: () => Promise<Result<string[], FolderReadError>>
		getReferenceData: () => Promise<Result<ReferenceData, { type: 'EVENT_FRAME_ERROR' }>>
		listSavesInFolder: (folderName: string) => Promise<Result<ListSavesResult, FolderReadError>>
		parseFullSave: (savePath: string) => Promise<Result<SaveData, ParseError>>
	}
}

// Renderer → Main (ipcMain.handle / ipcRenderer.invoke)
type IpcInvokeMapping = {
	getFoldersData: {
		args: void
		result: Result<string[], FolderReadError>
	}
	getReferenceData: {
		args: void
		result: Result<ReferenceData, { type: 'EVENT_FRAME_ERROR' }>
	}
	listSavesInFolder: {
		args: string
		result: Result<ListSavesResult, FolderReadError>
	}
	parseFullSave: {
		args: string
		result: Result<SaveData, ParseError>
	}
}
