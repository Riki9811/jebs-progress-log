// LRU semplice. Ogni `get` rinfresca la chiave portandola in fondo all'ordine
// di inserzione della Map; quando la dimensione eccede `max`, rimuoviamo la più vecchia.
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
