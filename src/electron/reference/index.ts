import { CELESTIAL_BODIES } from './celestialBodies.js'
import { ACTIVITIES, DEPLOYED_EXPERIMENTS } from './experiments.js'
import { SITUATIONS_DEF, RECOVERY_SITUATIONS } from './situations.js'
import { ok } from '../result.js'

export { STANDARD_SITUATIONS, RECOVERY_SITUATIONS, ALL_SITUATIONS, SITUATIONS_DEF } from './situations.js'
export { CELESTIAL_BODIES, BODY_NAMES } from './celestialBodies.js'
export { ACTIVITIES, DEPLOYED_EXPERIMENTS, ACTIVITY_NAMES, DEPLOYED_EXPERIMENT_NAMES } from './experiments.js'

// I dati sono già deep-frozen alla loro definizione: l'oggetto restituito riferisce
// gli stessi array immutabili, niente copie.
export function getReferenceData(): Result<ReferenceData, never> {
	return ok({
		bodies: CELESTIAL_BODIES,
		activities: ACTIVITIES,
		deployedExperiments: DEPLOYED_EXPERIMENTS,
		situations: SITUATIONS_DEF,
		recoverySituations: RECOVERY_SITUATIONS
	})
}
