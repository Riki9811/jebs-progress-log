// Minimal LRU cache. Each `get` refreshes the key by moving it to the end of the Map's
// insertion order; when size exceeds `max`, the oldest entry is evicted.
export class LruCache<K, V> {
	private map = new Map<K, V>()
	constructor(private max: number) {}

	get(key: K): V | undefined {
		const v = this.map.get(key)
		if (v !== undefined) {
			this.map.delete(key)
			this.map.set(key, v)
		}
		return v
	}

	set(key: K, value: V): void {
		if (this.map.has(key)) this.map.delete(key)
		this.map.set(key, value)
		if (this.map.size > this.max) {
			const oldest = this.map.keys().next().value
			if (oldest !== undefined) this.map.delete(oldest)
		}
	}
}
