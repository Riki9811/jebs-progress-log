import { tokenize, type SfsToken } from './sfsTokenizer.js'
import { ok, err } from '../result.js'

export type SfsValue = string | SfsBlock
export type SfsBlock = {
	[key: string]: SfsValue | SfsValue[]
}

export type SfsParseFailure = { line: number; reason: string }

export function parseSfs(input: string): Result<SfsBlock, SfsParseFailure> {
	const tokens = tokenize(input)
	const ctx = { pos: 0, tokens }

	const root: SfsBlock = {}
	while (ctx.pos < ctx.tokens.length) {
		const result = parseEntry(ctx, root)
		if (!result.ok) return result
	}
	return ok(root)
}

type Ctx = { pos: number; tokens: SfsToken[] }

function parseEntry(ctx: Ctx, target: SfsBlock): Result<void, SfsParseFailure> {
	const tok = ctx.tokens[ctx.pos]
	if (!tok) return ok(undefined)

	if (tok.type === 'KV') {
		addToBlock(target, tok.key, tok.value)
		ctx.pos++
		return ok(undefined)
	}
	if (tok.type === 'IDENT') {
		ctx.pos++
		const next = ctx.tokens[ctx.pos]
		if (!next || next.type !== 'LBRACE') {
			return err({ line: tok.line, reason: `expected '{' after block header '${tok.value}'` })
		}
		ctx.pos++ // consume LBRACE
		const sub = parseBlockBody(ctx, next.line)
		if (!sub.ok) return sub
		addToBlock(target, tok.value, sub.value)
		return ok(undefined)
	}
	return err({ line: tok.line, reason: `unexpected ${tok.type}` })
}

function parseBlockBody(ctx: Ctx, openLine: number): Result<SfsBlock, SfsParseFailure> {
	const block: SfsBlock = {}
	while (ctx.pos < ctx.tokens.length) {
		const tok = ctx.tokens[ctx.pos]!
		if (tok.type === 'RBRACE') {
			ctx.pos++
			return ok(block)
		}
		const result = parseEntry(ctx, block)
		if (!result.ok) return result
	}
	return err({ line: openLine, reason: 'unclosed block' })
}

function addToBlock(block: SfsBlock, key: string, value: SfsValue): void {
	const existing = block[key]
	if (existing === undefined) {
		block[key] = value
	} else if (Array.isArray(existing)) {
		existing.push(value)
	} else {
		block[key] = [existing, value]
	}
}
