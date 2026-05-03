import { describe, expect, it } from 'vitest'
import { CELESTIAL_BODIES, BODY_NAMES, findBody, prettyBiomeName } from './celestialBodies.js'
import {
	ACTIVITIES,
	ACTIVITY_NAMES,
	DEPLOYED_EXPERIMENTS,
	DEPLOYED_EXPERIMENT_NAMES,
	findActivity,
	findDeployedExperiment
} from './experiments.js'
import {
	STANDARD_SITUATIONS,
	RECOVERY_SITUATIONS,
	ALL_SITUATIONS,
	RECOVERY_DISPLAY_NAMES,
	SITUATIONS_DEF
} from './situations.js'
import { getReferenceData } from './index.js'

describe('celestial bodies', () => {
	it('contains all 17 vanilla bodies', () => {
		expect(CELESTIAL_BODIES).toHaveLength(17)
	})

	it('every body name is unique', () => {
		const names = CELESTIAL_BODIES.map((b) => b.name)
		expect(new Set(names).size).toBe(names.length)
	})

	it('Kerbin has 11 biomes', () => {
		const kerbin = findBody('Kerbin')!
		expect(kerbin.biomes).toHaveLength(11)
		expect(kerbin.biomes).toContain('NorthernIceShelf')
	})

	it('biome ids without explicit displayName get pretty-printed', () => {
		expect(prettyBiomeName('NorthernIceShelf')).toBe('Northern Ice Shelf')
		expect(prettyBiomeName('Highlands')).toBe('Highlands')
	})

	it('BODY_NAMES is in sync with CELESTIAL_BODIES', () => {
		expect(BODY_NAMES).toEqual(CELESTIAL_BODIES.map((b) => b.name))
	})

	it('every body and its arrays are deep-frozen', () => {
		const kerbin = findBody('Kerbin')!
		expect(Object.isFrozen(kerbin)).toBe(true)
		expect(Object.isFrozen(kerbin.biomes)).toBe(true)
		expect(Object.isFrozen(kerbin.recovery)).toBe(true)
		expect(Object.isFrozen(kerbin.recovery[0])).toBe(true)
	})
})

describe('activities and deployed experiments', () => {
	it('contains 18 activities and 4 deployed experiments', () => {
		expect(ACTIVITIES).toHaveLength(18)
		expect(DEPLOYED_EXPERIMENTS).toHaveLength(4)
	})

	it('every activity / deployed name is unique', () => {
		const all = [...ACTIVITY_NAMES, ...DEPLOYED_EXPERIMENT_NAMES]
		expect(new Set(all).size).toBe(all.length)
	})

	it('finders return known entries and undefined for unknown ones', () => {
		expect(findActivity('crewReport')?.displayName).toBe('Crew Report')
		expect(findActivity('thisDoesNotExist')).toBeUndefined()
		expect(findDeployedExperiment('deployedSeismicSensor')?.displayName).toBe('Seismic Sensor')
	})

	it('arrays are in sync', () => {
		expect(ACTIVITY_NAMES).toEqual(ACTIVITIES.map((a) => a.name))
		expect(DEPLOYED_EXPERIMENT_NAMES).toEqual(DEPLOYED_EXPERIMENTS.map((d) => d.name))
	})
})

describe('situations', () => {
	it('STANDARD has 6 entries, RECOVERY has 5, ALL has 11', () => {
		expect(STANDARD_SITUATIONS).toHaveLength(6)
		expect(RECOVERY_SITUATIONS).toHaveLength(5)
		expect(ALL_SITUATIONS).toHaveLength(11)
	})

	it('SITUATIONS_DEF has one definition per standard situation', () => {
		expect(SITUATIONS_DEF).toHaveLength(STANDARD_SITUATIONS.length)
		const defNames = SITUATIONS_DEF.map((s) => s.name).sort()
		expect(defNames).toEqual([...STANDARD_SITUATIONS].sort())
	})

	it('every SituationDef.activityTypes covers exactly the 18 activities', () => {
		const expected = [...ACTIVITY_NAMES].sort()
		for (const def of SITUATIONS_DEF) {
			const keys = Object.keys(def.activityTypes).sort()
			expect(keys, `${def.name} has wrong activity keys`).toEqual(expected)
		}
	})

	it('every recovery situation has a display name', () => {
		for (const r of RECOVERY_SITUATIONS) {
			expect(RECOVERY_DISPLAY_NAMES[r]).toBeTruthy()
		}
	})
})

describe('getReferenceData()', () => {
	it('returns the frozen reference snapshot', () => {
		const ref = getReferenceData()
		expect(ref.bodies).toBe(CELESTIAL_BODIES)
		expect(ref.activities).toBe(ACTIVITIES)
		expect(ref.deployedExperiments).toBe(DEPLOYED_EXPERIMENTS)
		expect(ref.situations).toBe(SITUATIONS_DEF)
		expect(ref.recoverySituations).toBe(RECOVERY_SITUATIONS)
		expect(Object.isFrozen(ref.bodies)).toBe(true)
		expect(Object.isFrozen(ref.activities)).toBe(true)
		expect(Object.isFrozen(ref.situations)).toBe(true)
	})
})
