import { BODY_NAMES } from '../reference/celestialBodies.js'
import { ALL_SITUATIONS } from '../reference/situations.js'
import { ok, err } from '../result.js'

// A Science record's id is encoded as `<experiment>@<Body><Situation>[<Biome>]`.
// Extract body and situation by longest-prefix match against the reference lists.
// Whatever remains after the situation is the biome (or null if empty).
export type ParsedScienceId = {
	experimentId: string
	body: string
	situation: Situation
	biome: string | null
}

export type ScienceIdParseFailure = { reason: string; rawId: string }

export function parseScienceId(rawId: string): Result<ParsedScienceId, ScienceIdParseFailure> {
	const at = rawId.indexOf('@')
	if (at < 0) {
		return err({ reason: 'missing @ separator', rawId })
	}
	const experimentId = rawId.slice(0, at)
	const location = rawId.slice(at + 1)
	if (experimentId === '' || location === '') {
		return err({ reason: 'empty experiment or location', rawId })
	}

	const body = longestPrefix(location, BODY_NAMES)
	if (!body) {
		return err({ reason: 'no known body matches the location', rawId })
	}

	const afterBody = location.slice(body.length)
	const situation = longestPrefix(afterBody, ALL_SITUATIONS as readonly string[])
	if (!situation) {
		return err({ reason: 'no known situation matches', rawId })
	}

	const biomeRaw = afterBody.slice(situation.length)
	return ok({
		experimentId,
		body,
		situation: situation as Situation,
		biome: biomeRaw === '' ? null : biomeRaw
	})
}

function longestPrefix(input: string, candidates: readonly string[]): string | null {
	let best: string | null = null
	for (const c of candidates) {
		if (input.startsWith(c) && (!best || c.length > best.length)) {
			best = c
		}
	}
	return best
}
