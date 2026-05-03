import { describe, expect, it } from 'vitest'
import { extractSaveData } from './extractSaveData.js'

const SAVE_PATH = '/tmp/Riccardo/persistent.sfs'

describe('extractSaveData', () => {
	it('extracts summary from GAME header', () => {
		const input = `GAME
{
	version = 1.12.5
	Mode = CAREER
}`
		const r = extractSaveData(input, SAVE_PATH)
		expect(r.ok).toBe(true)
		if (r.ok) {
			expect(r.value.gameVersion).toBe('1.12.5')
			expect(r.value.mode).toBe('CAREER')
			expect(r.value.fileName).toBe('persistent.sfs')
			expect(r.value.folderName).toBe('Riccardo')
			expect(r.value.totalScience).toBe(0)
			expect(r.value.experimentCount).toBe(0)
		}
	})

	it('falls back to SANDBOX when Mode is missing or invalid', () => {
		const r = extractSaveData('GAME\n{\nversion = 1.0\n}', SAVE_PATH)
		expect(r.ok).toBe(true)
		if (r.ok) expect(r.value.mode).toBe('SANDBOX')
	})

	it('returns NO_GAME_BLOCK when there is no GAME block', () => {
		const r = extractSaveData('something\n{\nx = 1\n}', SAVE_PATH)
		expect(r.ok).toBe(false)
		if (!r.ok) expect(r.error.type).toBe('NO_GAME_BLOCK')
	})

	it('forwards parse errors', () => {
		const r = extractSaveData('GAME\n{\nversion = 1', SAVE_PATH)
		expect(r.ok).toBe(false)
		if (!r.ok && r.error.type === 'PARSE') {
			expect(r.error.reason).toMatch(/unclosed/)
		}
	})

	it('extracts a single Science record from ResearchAndDevelopment', () => {
		const input = `GAME
{
	version = 1.12.5
	Mode = CAREER
	SCENARIO
	{
		name = ResearchAndDevelopment
		sci = 26.6
		Science
		{
			id = crewReport@KerbinSrfLandedShores
			title = Crew Report from Kerbin's Shores
			sci = 0.5
			cap = 1.5
			dsc = 1
			scv = 0.5
			sbv = 1
		}
	}
}`
		const r = extractSaveData(input, SAVE_PATH)
		expect(r.ok).toBe(true)
		if (r.ok) {
			expect(r.value.totalScience).toBe(26.6)
			expect(r.value.scienceRecords).toHaveLength(1)
			const record = r.value.scienceRecords[0]!
			expect(record.experimentId).toBe('crewReport')
			expect(record.body).toBe('Kerbin')
			expect(record.situation).toBe('SrfLanded')
			expect(record.biome).toBe('Shores')
			expect(record.collected).toBe(0.5)
			expect(record.total).toBe(1.5)
		}
	})

	it('aggregates standard records under perSituation → biomes (or global)', () => {
		const input = `GAME
{
	SCENARIO
	{
		name = ResearchAndDevelopment
		Science
		{
			id = crewReport@KerbinSrfLandedShores
			sci = 0.5
			cap = 1.5
		}
		Science
		{
			id = mysteryGoo@KerbinSrfLandedShores
			sci = 4.5
			cap = 9.0
		}
		Science
		{
			id = crewReport@MunInSpaceLow
			sci = 7.0
			cap = 15.0
		}
	}
}`
		const r = extractSaveData(input, SAVE_PATH)
		expect(r.ok).toBe(true)
		if (!r.ok) return

		expect(r.value.scienceRecords).toHaveLength(3)

		const kerbin = r.value.aggregations.perBody.Kerbin
		expect(kerbin).toBeDefined()
		if (!kerbin) return
		expect(kerbin.scienceCollected).toBeCloseTo(5.0, 5)
		expect(kerbin.experimentCount).toBe(2)

		const landed = kerbin.perSituation.SrfLanded
		expect(landed?.recordCount).toBe(2)
		expect(landed?.biomes.Shores).toBeDefined()
		expect(Object.keys(landed?.biomes.Shores?.perExperiment ?? {})).toEqual(
			expect.arrayContaining(['crewReport', 'mysteryGoo'])
		)
		expect(Object.keys(landed?.global ?? {})).toHaveLength(0)

		const mun = r.value.aggregations.perBody.Mun
		const munInSpaceLow = mun?.perSituation.InSpaceLow
		// crewReport@MunInSpaceLow ha biome vuoto → finisce in global
		expect(munInSpaceLow?.global.crewReport).toBeDefined()
		expect(Object.keys(munInSpaceLow?.biomes ?? {})).toHaveLength(0)
		expect(r.value.aggregations.totalScienceCollected).toBeCloseTo(12.0, 5)
	})

	it('routes records to the 3 channels: perSituation / deployedPerSituation / recoveries', () => {
		const input = `GAME
{
	SCENARIO
	{
		name = ResearchAndDevelopment
		Science
		{
			id = crewReport@KerbinSrfLandedShores
			sci = 1.0
			cap = 1.5
		}
		Science
		{
			id = deployedSeismicSensor@MunSrfLandedHighlands
			sci = 2.0
			cap = 3.0
		}
		Science
		{
			id = recovery@KerbinSurfaced
			sci = 5.0
			cap = 6.0
		}
		Science
		{
			id = crewReport@KerbinFlew
			sci = 0.7
			cap = 1.0
		}
	}
}`
		const r = extractSaveData(input, SAVE_PATH)
		expect(r.ok).toBe(true)
		if (!r.ok) return

		const kerbin = r.value.aggregations.perBody.Kerbin
		expect(kerbin).toBeDefined()
		if (!kerbin) return

		// activity standard → perSituation
		expect(kerbin.perSituation.SrfLanded?.biomes.Shores?.perExperiment.crewReport).toBeDefined()

		// recovery records → recoveries
		expect(kerbin.recoveries.Surfaced?.perExperiment.recovery).toBeDefined()
		expect(kerbin.recoveries.Flew?.perExperiment.crewReport).toBeDefined()

		// deployed experiment → deployedPerSituation (su Mun)
		const mun = r.value.aggregations.perBody.Mun
		expect(mun?.deployedPerSituation.SrfLanded?.biomes.Highlands?.perExperiment.deployedSeismicSensor).toBeDefined()
		// e NON deve apparire nel canale standard
		expect(mun?.perSituation.SrfLanded).toBeUndefined()
	})

	it('skips records with malformed ids without failing the whole parse', () => {
		const input = `GAME
{
	SCENARIO
	{
		name = ResearchAndDevelopment
		Science
		{
			id = noAtSign
			sci = 1.0
		}
		Science
		{
			id = crewReport@KerbinSrfLandedShores
			sci = 0.5
		}
	}
}`
		const r = extractSaveData(input, SAVE_PATH)
		expect(r.ok).toBe(true)
		if (r.ok) expect(r.value.scienceRecords).toHaveLength(1)
	})

	it('handles a save with multiple SCENARIO blocks (only ResearchAndDevelopment matters)', () => {
		const input = `GAME
{
	SCENARIO
	{
		name = ContractSystem
		foo = bar
	}
	SCENARIO
	{
		name = ResearchAndDevelopment
		sci = 5.0
		Science
		{
			id = crewReport@KerbinSrfLandedShores
			sci = 0.5
		}
	}
	SCENARIO
	{
		name = ProgressTracking
	}
}`
		const r = extractSaveData(input, SAVE_PATH)
		expect(r.ok).toBe(true)
		if (r.ok) {
			expect(r.value.totalScience).toBe(5.0)
			expect(r.value.scienceRecords).toHaveLength(1)
		}
	})

	it('falls back to summing record sci when GAME.SCENARIO[R&D].sci is missing', () => {
		const input = `GAME
{
	SCENARIO
	{
		name = ResearchAndDevelopment
		Science
		{
			id = crewReport@KerbinSrfLandedShores
			sci = 1.5
		}
		Science
		{
			id = mysteryGoo@KerbinSrfLandedShores
			sci = 2.5
		}
	}
}`
		const r = extractSaveData(input, SAVE_PATH)
		expect(r.ok).toBe(true)
		if (r.ok) expect(r.value.totalScience).toBe(4.0)
	})
})
