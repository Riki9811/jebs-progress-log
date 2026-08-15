/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import svgr from 'vite-plugin-svgr'

export default defineConfig({
	plugins: [react(), tailwindcss(), svgr()],
	base: './',
	build: {
		outDir: 'dist-react'
	},
	server: {
		port: 5123,
		strictPort: true
	},
	test: {
		environment: 'node',
		include: ['src/**/*.{test,spec}.ts', 'tests/**/*.{test,spec}.ts']
	}
})
