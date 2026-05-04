import type { SfsBlock, SfsValue } from './sfsParser.js'

// Accessor tipati per i nodi di un SfsBlock. Il parser non distingue tra "campo singolo"
// e "campo ripetuto": chi consuma sceglie via `asArray` / `stringField` / `numberField`
// secondo cosa si aspetta. `isBlock` discrimina tra valore stringa e sub-blocco.

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
