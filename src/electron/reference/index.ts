export {
	STANDARD_SITUATIONS,
	RECOVERY_SITUATIONS,
	ALL_SITUATIONS,
	RECOVERY_DISPLAY_NAMES,
	SITUATIONS_DEF
} from './situations.js'

export { CELESTIAL_BODIES, BODY_NAMES, findBody, prettyBiomeName } from './celestialBodies.js'

export {
	ACTIVITIES,
	DEPLOYED_EXPERIMENTS,
	ACTIVITY_NAMES,
	DEPLOYED_EXPERIMENT_NAMES,
	findActivity,
	findDeployedExperiment
} from './experiments.js'

import { CELESTIAL_BODIES } from './celestialBodies.js'
import { ACTIVITIES, DEPLOYED_EXPERIMENTS } from './experiments.js'
import { SITUATIONS_DEF, RECOVERY_SITUATIONS } from './situations.js'

// I dati sono già deep-frozen alla loro definizione. Niente copie:
// rendiamo esplicito al chiamante che il valore è immutabile (il TS readonly basta).
export function getReferenceData(): ReferenceData {
	return {
		bodies: CELESTIAL_BODIES,
		activities: ACTIVITIES,
		deployedExperiments: DEPLOYED_EXPERIMENTS,
		situations: SITUATIONS_DEF,
		recoverySituations: RECOVERY_SITUATIONS
	}
}
