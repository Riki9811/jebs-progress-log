import { describe, expect, it } from 'vitest'
import { parseScienceId } from './scienceIdParser.js'

describe('parseScienceId', () => {
	it('parses experiment + body + standard situation + biome', () => {
		const r = parseScienceId('crewReport@KerbinSrfLandedShores')
		expect(r.ok).toBe(true)
		if (r.ok) {
			expect(r.value).toEqual({
				experimentId: 'crewReport',
				body: 'Kerbin',
				situation: 'SrfLanded',
				biome: 'Shores'
			})
		}
	})

	it('parses ids without a biome (empty residue → null)', () => {
		const r = parseScienceId('evaReport@EveSrfSplashed')
		expect(r.ok).toBe(true)
		if (r.ok) {
			expect(r.value.body).toBe('Eve')
			expect(r.value.situation).toBe('SrfSplashed')
			expect(r.value.biome).toBeNull()
		}
	})

	it('handles the special "Flew" situation used by the recovery experiment', () => {
		const r = parseScienceId('recovery@KerbinFlew')
		expect(r.ok).toBe(true)
		if (r.ok) {
			expect(r.value.experimentId).toBe('recovery')
			expect(r.value.body).toBe('Kerbin')
			expect(r.value.situation).toBe('Flew')
			expect(r.value.biome).toBeNull()
		}
	})

	it('parses InSpaceLow + biome correctly (Mun)', () => {
		const r = parseScienceId('mysteryGoo@MunInSpaceLowMidlands')
		expect(r.ok).toBe(true)
		if (r.ok) {
			expect(r.value.body).toBe('Mun')
			expect(r.value.situation).toBe('InSpaceLow')
			expect(r.value.biome).toBe('Midlands')
		}
	})

	it('disambiguates situations sharing a prefix (Flew vs FlewBy)', () => {
		// 'Flew' is a prefix of 'FlewBy'; longest-prefix must pick the right one.
		const a = parseScienceId('recovery@KerbinFlew')
		const b = parseScienceId('recovery@KerbinFlewBy')
		expect(a.ok).toBe(true)
		expect(b.ok).toBe(true)
		if (a.ok) expect(a.value.situation).toBe('Flew')
		if (b.ok) expect(b.value.situation).toBe('FlewBy')
	})

	it('fails on missing @ separator', () => {
		const r = parseScienceId('noAtSign')
		expect(r.ok).toBe(false)
		if (!r.ok) expect(r.error.reason).toMatch(/missing @/)
	})

	it('fails on unknown body', () => {
		const r = parseScienceId('crewReport@AtlantisSrfLanded')
		expect(r.ok).toBe(false)
	})

	it('fails on unknown situation after a known body', () => {
		const r = parseScienceId('crewReport@KerbinNotASituation')
		expect(r.ok).toBe(false)
		if (!r.ok) expect(r.error.reason).toMatch(/situation/)
	})
})
