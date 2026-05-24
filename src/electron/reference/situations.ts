import { deepFreeze } from '../freeze.js'

// The 6 in-flight situations that drive the activityTypes matrix in the UI tables.
// The source of truth for recovery situation display names is the `displayName` field
// inside `body.recovery` for each body in `celestialBodies.ts`.
export const STANDARD_SITUATIONS = [
	'SrfLanded',
	'SrfSplashed',
	'FlyingLow',
	'FlyingHigh',
	'InSpaceLow',
	'InSpaceHigh'
] as const satisfies readonly StandardSituation[]

// The 5 recovery situations that can appear in save scienceIds
// (e.g. `recovery@MunSurfaced`, `crewReport@KerbinFlew`).
export const RECOVERY_SITUATIONS = [
	'Flew',
	'SubOrbited',
	'Orbited',
	'FlewBy',
	'Surfaced'
] as const satisfies readonly RecoverySituation[]

// Full list used by the scienceIdParser for longest-prefix matching.
export const ALL_SITUATIONS = [
	...STANDARD_SITUATIONS,
	...RECOVERY_SITUATIONS
] as const satisfies readonly Situation[]

// Full definitions for the 6 standard situations: includes displayName and the activityTypes
// matrix (per Activity, whether this situation yields a per-biome record, a single "global"
// record, or is unavailable).
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
