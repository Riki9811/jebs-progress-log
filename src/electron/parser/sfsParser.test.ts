import { describe, expect, it } from 'vitest'
import { tokenize } from './sfsTokenizer.js'
import { parseSfs } from './sfsParser.js'

describe('tokenizer', () => {
	it('skips empty lines and comments', () => {
		const tokens = tokenize('\n  // a comment\n\nGAME\n')
		expect(tokens).toHaveLength(1)
		expect(tokens[0]).toMatchObject({ type: 'IDENT', value: 'GAME' })
	})

	it('parses key=value pairs with whitespace tolerance', () => {
		const tokens = tokenize('   version  =   1.12.5   ')
		expect(tokens[0]).toMatchObject({ type: 'KV', key: 'version', value: '1.12.5' })
	})

	it('preserves spaces within values', () => {
		const tokens = tokenize('title = Crew Report from Kerbin')
		expect(tokens[0]).toMatchObject({
			type: 'KV',
			key: 'title',
			value: 'Crew Report from Kerbin'
		})
	})

	it('preserves equals signs within values (only first = is the separator)', () => {
		const tokens = tokenize('formula = a = b + c')
		expect(tokens[0]).toMatchObject({ type: 'KV', key: 'formula', value: 'a = b + c' })
	})
})

describe('parser', () => {
	it('parses an empty input as an empty root block', () => {
		const r = parseSfs('')
		expect(r.ok).toBe(true)
		if (r.ok) expect(r.value).toEqual({})
	})

	it('parses a single block with one kv', () => {
		const r = parseSfs('GAME\n{\nversion = 1.12.5\n}')
		expect(r.ok).toBe(true)
		if (r.ok) expect(r.value).toEqual({ GAME: { version: '1.12.5' } })
	})

	it('parses nested blocks', () => {
		const input = 'GAME\n{\nSCENARIO\n{\nname = ResearchAndDevelopment\nsci = 26.6\n}\n}'
		const r = parseSfs(input)
		expect(r.ok).toBe(true)
		if (r.ok) {
			expect(r.value).toEqual({
				GAME: {
					SCENARIO: { name: 'ResearchAndDevelopment', sci: '26.6' }
				}
			})
		}
	})

	it('collects duplicate sibling blocks into an array', () => {
		const input = `R
{
	Science
	{
		id = a@KerbinSrfLanded
	}
	Science
	{
		id = b@KerbinSrfLanded
	}
	Science
	{
		id = c@KerbinSrfLanded
	}
}`
		const r = parseSfs(input)
		expect(r.ok).toBe(true)
		if (r.ok) {
			const science = (r.value.R as { Science: unknown }).Science
			expect(Array.isArray(science)).toBe(true)
			expect(science).toHaveLength(3)
		}
	})

	it('collects duplicate kv into an array', () => {
		const r = parseSfs('A\n{\nx = 1\nx = 2\n}')
		expect(r.ok).toBe(true)
		if (r.ok) {
			expect(r.value).toEqual({ A: { x: ['1', '2'] } })
		}
	})

	it('reports unclosed blocks with the opening line', () => {
		const r = parseSfs('GAME\n{\nversion = 1.0\n')
		expect(r.ok).toBe(false)
		if (!r.ok) {
			expect(r.error.reason).toMatch(/unclosed/)
			expect(r.error.line).toBe(2)
		}
	})

	it('rejects a block header not followed by an opening brace', () => {
		const r = parseSfs('GAME\nversion = 1.0\n')
		expect(r.ok).toBe(false)
		if (!r.ok) expect(r.error.reason).toMatch(/expected '\{'/)
	})

	it('parses a realistic GAME → SCENARIO[ResearchAndDevelopment] → Science fragment', () => {
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
		}
	}
}`
		const r = parseSfs(input)
		expect(r.ok).toBe(true)
		if (r.ok) {
			const game = r.value.GAME as Record<string, unknown>
			expect(game.version).toBe('1.12.5')
			expect(game.Mode).toBe('CAREER')
			const scenario = game.SCENARIO as Record<string, unknown>
			expect(scenario.name).toBe('ResearchAndDevelopment')
			const science = scenario.Science as Record<string, string>
			expect(science.id).toBe('crewReport@KerbinSrfLandedShores')
		}
	})
})
