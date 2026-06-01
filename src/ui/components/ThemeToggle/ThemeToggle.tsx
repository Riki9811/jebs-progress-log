import { useTheme } from '../../hooks/useTheme'
import styles from './ThemeToggle.module.css'

const nextTheme: Record<Preferences['theme'], Preferences['theme']> = {
	system: 'dark',
	dark: 'light',
	light: 'system'
}

const themeLabel: Record<Preferences['theme'], string> = {
	system: 'System',
	dark: 'Dark',
	light: 'Light'
}

type Props = {
	className?: string
}

function ThemeToggle({ className }: Props) {
	const { theme, setTheme } = useTheme()

	return (
		<button
			type="button"
			className={[styles.root, className].filter(Boolean).join(' ')}
			onClick={() => setTheme(nextTheme[theme])}
		>
			Theme: {themeLabel[theme]}
		</button>
	)
}

export default ThemeToggle
