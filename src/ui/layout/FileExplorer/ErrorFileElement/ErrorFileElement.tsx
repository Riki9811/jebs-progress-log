import ErrorRow from '../ErrorRow/ErrorRow'

type Props = {
	fileName: string
	error: ParseFullSaveError
}

function describe(error: ParseFullSaveError): string {
	switch (error.code) {
		case 'FILE_NOT_FOUND':
			return 'FILE_NOT_FOUND'
		case 'INVALID_FORMAT':
			return `INVALID_FORMAT (line ${error.line}): ${error.reason}`
		case 'IO_ERROR':
			return `IO_ERROR: ${error.reason}`
	}
}

function ErrorFileElement({ fileName, error }: Props) {
	return <ErrorRow title={fileName} detail={describe(error)} showTitle />
}

export default ErrorFileElement
