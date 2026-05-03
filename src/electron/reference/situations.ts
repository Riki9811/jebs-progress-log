import { deepFreeze } from '../freeze.js'

// Le 6 situazioni "in flight" che pilotano la matrice activityTypes nelle tabelle UI.
export const STANDARD_SITUATIONS = [
	'SrfLanded',
	'SrfSplashed',
	'FlyingLow',
	'FlyingHigh',
	'InSpaceLow',
	'InSpaceHigh'
] as const satisfies readonly StandardSituation[]

// Le 5 situazioni di recovery che possono comparire negli scienceId del save
// (es. `recovery@MunSurfaced`, `crewReport@KerbinFlew`).
export const RECOVERY_SITUATIONS = [
	'Flew',
	'SubOrbited',
	'Orbited',
	'FlewBy',
	'Surfaced'
] as const satisfies readonly RecoverySituation[]

// Lista completa usata dallo scienceIdParser per il longest-prefix match.
export const ALL_SITUATIONS = [
	...STANDARD_SITUATIONS,
	...RECOVERY_SITUATIONS
] as const satisfies readonly Situation[]

export const RECOVERY_DISPLAY_NAMES: Readonly<Record<RecoverySituation, string>> = deepFreeze({
	Flew: 'Flight',
	SubOrbited: 'Sub-orbit',
	Orbited: 'Orbit',
	FlewBy: 'Fly-by',
	Surfaced: 'Landed'
})

// Definizione ricca delle 6 situazioni standard: include il displayName e la matrice
// activityTypes (per ogni Activity dice se in questa situation produce record per-biome,
// un singolo record "global", oppure non è disponibile).
export const SITUATIONS_DEF: readonly SituationDef[] = deepFreeze([
	{
		name: 'SrfLanded',
		displayName: 'Landed',
		requiresAtmosphere: false,
		requiresWater: false,
		requiresLanding: true,
		activityTypes: {
			asteroidSample: 'biome',
			atmosphereAnalysis: 'biome',
			barometerScan: 'biome',
			cometSample_short: 'biome',
			cometSample_intermediate: 'biome',
			cometSample_long: 'biome',
			cometSample_interstellar: 'biome',
			crewReport: 'biome',
			evaScience: 'global',
			evaReport: 'biome',
			gravityScan: 'biome',
			infraredTelescope: null,
			magnetometer: null,
			mobileMaterialsLab: 'biome',
			mysteryGoo: 'biome',
			seismicScan: 'biome',
			surfaceSample: 'biome',
			temperatureScan: 'biome'
		}
	},
	{
		name: 'SrfSplashed',
		displayName: 'Splashed',
		requiresAtmosphere: false,
		requiresWater: true,
		requiresLanding: true,
		activityTypes: {
			asteroidSample: 'biome',
			atmosphereAnalysis: null,
			barometerScan: 'biome',
			cometSample_short: 'biome',
			cometSample_intermediate: 'biome',
			cometSample_long: 'biome',
			cometSample_interstellar: 'biome',
			crewReport: 'biome',
			evaScience: null,
			evaReport: 'biome',
			gravityScan: 'biome',
			infraredTelescope: null,
			magnetometer: null,
			mobileMaterialsLab: 'biome',
			mysteryGoo: 'biome',
			seismicScan: null,
			surfaceSample: 'biome',
			temperatureScan: 'biome'
		}
	},
	{
		name: 'FlyingLow',
		displayName: 'Flying Low',
		requiresAtmosphere: true,
		requiresWater: false,
		requiresLanding: false,
		activityTypes: {
			asteroidSample: 'biome',
			atmosphereAnalysis: 'biome',
			barometerScan: 'global',
			cometSample_short: 'biome',
			cometSample_intermediate: 'biome',
			cometSample_long: 'biome',
			cometSample_interstellar: 'biome',
			crewReport: 'biome',
			evaScience: null,
			evaReport: 'biome',
			gravityScan: null,
			infraredTelescope: null,
			magnetometer: null,
			mobileMaterialsLab: 'global',
			mysteryGoo: 'global',
			seismicScan: null,
			surfaceSample: null,
			temperatureScan: 'biome'
		}
	},
	{
		name: 'FlyingHigh',
		displayName: 'Flying High',
		requiresAtmosphere: true,
		requiresWater: false,
		requiresLanding: false,
		activityTypes: {
			asteroidSample: 'global',
			atmosphereAnalysis: 'biome',
			barometerScan: 'global',
			cometSample_short: 'global',
			cometSample_intermediate: 'global',
			cometSample_long: 'global',
			cometSample_interstellar: 'global',
			crewReport: 'global',
			evaScience: null,
			evaReport: 'global',
			gravityScan: null,
			infraredTelescope: null,
			magnetometer: null,
			mobileMaterialsLab: 'global',
			mysteryGoo: 'global',
			seismicScan: null,
			surfaceSample: null,
			temperatureScan: 'global'
		}
	},
	{
		name: 'InSpaceLow',
		displayName: 'In Space Low',
		requiresAtmosphere: false,
		requiresWater: false,
		requiresLanding: false,
		activityTypes: {
			asteroidSample: 'global',
			atmosphereAnalysis: null,
			barometerScan: 'global',
			cometSample_short: 'global',
			cometSample_intermediate: 'global',
			cometSample_long: 'global',
			cometSample_interstellar: 'global',
			crewReport: 'global',
			evaScience: 'global',
			evaReport: 'biome',
			gravityScan: 'biome',
			infraredTelescope: null,
			magnetometer: 'global',
			mobileMaterialsLab: 'global',
			mysteryGoo: 'global',
			seismicScan: null,
			surfaceSample: null,
			temperatureScan: 'global'
		}
	},
	{
		name: 'InSpaceHigh',
		displayName: 'In Space High',
		requiresAtmosphere: false,
		requiresWater: false,
		requiresLanding: false,
		activityTypes: {
			asteroidSample: 'global',
			atmosphereAnalysis: null,
			barometerScan: 'global',
			cometSample_short: 'global',
			cometSample_intermediate: 'global',
			cometSample_long: 'global',
			cometSample_interstellar: 'global',
			crewReport: 'global',
			evaScience: 'global',
			evaReport: 'global',
			gravityScan: 'biome',
			infraredTelescope: 'global',
			magnetometer: 'global',
			mobileMaterialsLab: 'global',
			mysteryGoo: 'global',
			seismicScan: null,
			surfaceSample: null,
			temperatureScan: 'global'
		}
	}
])
