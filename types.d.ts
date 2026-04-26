type FolderReadError = 'NOT_EXISTS' | 'NOT_FOLDER' | 'CANNOT_READ' | 'UNKNOWN_ERROR'

type FolderReadResponse = string[] | FolderReadError

type TestEventData = string

type UnsubscribeFunction = () => void

interface Window {
	electron: {
		subscribeTestEvent: (callback: (testData: TestEventData) => void) => UnsubscribeFunction
		getFoldersData: () => Promise<FolderReadResponse>
	}
}

type EventPayloadMapping = {
	getFoldersData: FolderReadResponse
	test: TestEventData
}
