export const ErrorLevel = {
	Info: "info",
	Warn: "warn",
	Critical: "critical",
} as const

export const RankedErrorLevel = [
	ErrorLevel.Info,
	ErrorLevel.Warn,
	ErrorLevel.Critical,
]

export type ErrorLevel = (typeof ErrorLevel)[keyof typeof ErrorLevel]

export const parseErrorMessageFromUnknown = (error: unknown): string => {
	const errMsg =
		error instanceof Error
			? error.message
			: typeof error === "string"
			? error
			: error instanceof Object
			? JSON.stringify(error)
			: "Unknown error"
	return errMsg
}

export class DomainError extends Error {
	name: string
	level: ErrorLevel
	constructor(message?: string | unknown | Error, level?: ErrorLevel) {
		super(parseErrorMessageFromUnknown(message))
		this.name = this.constructor.name
		this.level = level || ErrorLevel.Info
	}
}

export class ExpiredSessionError extends DomainError {
	level = ErrorLevel.Critical
}

export class InvalidAuthenticatorError extends DomainError {
	level = ErrorLevel.Critical
}

export class InvalidProfileError extends DomainError {}
