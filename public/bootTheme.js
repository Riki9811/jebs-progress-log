;(function () {
	var pref = (window.bootPreferences && window.bootPreferences.theme) || 'system'
	var isLight =
		pref === 'system' ? !window.matchMedia('(prefers-color-scheme: dark)').matches : pref === 'light'
	if (isLight) document.body.classList.add('lightTheme')
})()
