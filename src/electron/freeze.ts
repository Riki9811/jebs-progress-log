export function deepFreeze<T>(value: T): T {
	if (value === null || typeof value !== 'object') return value
	if (Object.isFrozen(value)) return value
	Object.values(value as object).forEach(deepFreeze)
	return Object.freeze(value)
}
