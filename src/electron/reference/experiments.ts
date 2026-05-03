import { deepFreeze } from '../freeze.js'

// Le 18 "activities" vanilla di KSP (esperimenti scientifici standard).
// L'id (`name`) è quello che compare prima della `@` negli scienceId del save.
export const ACTIVITIES: readonly Activity[] = deepFreeze([
	{ name: 'asteroidSample', displayName: 'Asteroid Sample', requiresAtmosphere: false },
	{ name: 'atmosphereAnalysis', displayName: 'Atmosphere Analysis', requiresAtmosphere: true },
	{ name: 'barometerScan', displayName: 'Barometer Scan', requiresAtmosphere: false },
	{ name: 'cometSample_short', displayName: 'Short Comet Sample', requiresAtmosphere: false },
	{ name: 'cometSample_intermediate', displayName: 'Intermediate Comet Sample', requiresAtmosphere: false },
	{ name: 'cometSample_long', displayName: 'Long Comet Sample', requiresAtmosphere: false },
	{ name: 'cometSample_interstellar', displayName: 'Interstellar Comet Sample', requiresAtmosphere: false },
	{ name: 'crewReport', displayName: 'Crew Report', requiresAtmosphere: false },
	{ name: 'evaScience', displayName: 'Eva Science', requiresAtmosphere: false },
	{ name: 'evaReport', displayName: 'Eva Report', requiresAtmosphere: false },
	{ name: 'gravityScan', displayName: 'Gravity Scan', requiresAtmosphere: false },
	{ name: 'infraredTelescope', displayName: 'Infrared Telescope', requiresAtmosphere: false },
	{ name: 'magnetometer', displayName: 'Magnetometer', requiresAtmosphere: false },
	{ name: 'mobileMaterialsLab', displayName: 'Mobile Materials Lab', requiresAtmosphere: false },
	{ name: 'mysteryGoo', displayName: 'Mystery Goo', requiresAtmosphere: false },
	{ name: 'seismicScan', displayName: 'Seismic Scan', requiresAtmosphere: false },
	{ name: 'surfaceSample', displayName: 'Surface Sample', requiresAtmosphere: false },
	{ name: 'temperatureScan', displayName: 'Temperature Scan', requiresAtmosphere: false }
])

// I 4 esperimenti del DLC Breaking Ground. Pattern dell'id identico alle activities standard.
export const DEPLOYED_EXPERIMENTS: readonly DeployedExperiment[] = deepFreeze([
	{ name: 'deployedGooObservation', displayName: 'Goo Observation', requiresAtmosphere: false, requiresVacuum: false },
	{ name: 'deployedIONCollector', displayName: 'ION Collector', requiresAtmosphere: false, requiresVacuum: true },
	{ name: 'deployedSeismicSensor', displayName: 'Seismic Sensor', requiresAtmosphere: false, requiresVacuum: false },
	{ name: 'deployedWeatherReport', displayName: 'Weather Report', requiresAtmosphere: true, requiresVacuum: false }
])

export const ACTIVITY_NAMES: readonly string[] = ACTIVITIES.map((a) => a.name)
export const DEPLOYED_EXPERIMENT_NAMES: readonly string[] = DEPLOYED_EXPERIMENTS.map((d) => d.name)

export function findActivity(name: string): Activity | undefined {
	return ACTIVITIES.find((a) => a.name === name)
}

export function findDeployedExperiment(name: string): DeployedExperiment | undefined {
	return DEPLOYED_EXPERIMENTS.find((d) => d.name === name)
}
