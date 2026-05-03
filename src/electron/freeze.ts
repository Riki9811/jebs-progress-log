// Deep-freeze ricorsivo per garantire che le costanti di reference siano davvero immutabili.
// Usato dai moduli `reference/*` ai dati esposti dal back-end.
export function deepFreeze<T>(value: T): T {
	if (value === null || typeof value !== 'object') return value
	if (Object.isFrozen(value)) return value
	for (const key of Object.keys(value as object)) {
		deepFreeze((value as Record<string, unknown>)[key])
	}
	return Object.freeze(value)
}
