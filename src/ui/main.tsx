import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { config } from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css'
import './reset.css'
import './index.css'
import App from './App.tsx'
import ThemeProvider from './context/ThemeProvider'
import ErrorProvider from './context/ErrorProvider'
import SettingsProvider from './context/SettingsProvider'

// Insert FontAwesome's CSS via the bundler instead of letting it inject a <style>
// tag at runtime, so the stylesheet order is deterministic and under our control.
config.autoAddCss = false

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<ThemeProvider>
			<ErrorProvider>
				<SettingsProvider>
					<App />
				</SettingsProvider>
			</ErrorProvider>
		</ThemeProvider>
	</StrictMode>
)
