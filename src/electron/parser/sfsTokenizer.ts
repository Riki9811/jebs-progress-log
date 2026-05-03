// Line-based tokenizer for the .sfs format.
// Each non-empty line is one of: an identifier (block header), '{', '}', or 'key = value'.

export type SfsToken =
	| { type: 'IDENT'; value: string; line: number }
	| { type: 'LBRACE'; line: number }
	| { type: 'RBRACE'; line: number }
	| { type: 'KV'; key: string; value: string; line: number }

export function tokenize(input: string): SfsToken[] {
	const tokens: SfsToken[] = []
	const lines = input.split(/\r?\n/)

	for (let i = 0; i < lines.length; i++) {
		const lineNum = i + 1
		const trimmed = lines[i]!.trim()
		if (trimmed === '' || trimmed.startsWith('//')) continue

		if (trimmed === '{') {
			tokens.push({ type: 'LBRACE', line: lineNum })
		} else if (trimmed === '}') {
			tokens.push({ type: 'RBRACE', line: lineNum })
		} else {
			const eq = trimmed.indexOf('=')
			if (eq >= 0) {
				const key = trimmed.slice(0, eq).trim()
				const value = trimmed.slice(eq + 1).trim()
				tokens.push({ type: 'KV', key, value, line: lineNum })
			} else {
				tokens.push({ type: 'IDENT', value: trimmed, line: lineNum })
			}
		}
	}

	return tokens
}
