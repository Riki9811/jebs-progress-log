export const ok = <V>(value: V): Result<V, never> => ({ ok: true, value })

export function err<C extends string, P extends object = object>(
	code: C,
	payload?: P
): Result<never, { code: C } & P> {
	return { ok: false, error: { code, ...payload } as { code: C } & P }
}
