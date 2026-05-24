import type { SfsBlock, SfsValue } from './sfsParser.js'

// Typed accessors for SfsBlock nodes. The parser does not distinguish between a single
// field and a repeated field: callers choose via `asArray` / `stringField` / `numberField`
// based on the expected shape. `isBlock` discriminates between a string value and a sub-block.

export function isBlock(v: SfsValue | SfsValue[] | undefined): v is SfsBlock {
	return typeof v === 'object' && v !== null && !Array.isArray(v)
}

export function asArray(v: SfsValue | SfsValue[] | undefined): SfsValue[] {
	if (v === undefined) return []
	return Array.isArray(v) ? v : [v]
}

export function stringField(v: SfsValue | SfsValue[] | undefined): string | null {
	return typeof v === 'string' ? v : null
}

export function numberField(v: SfsValue | SfsValue[] | undefined, fallback: number): number {
	if (typeof v !== 'string') return fallback
	const n = parseFloat(v)
	return Number.isFinite(n) ? n : fallback
}
