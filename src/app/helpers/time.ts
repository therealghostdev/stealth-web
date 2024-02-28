export const formatTime = (seconds: number): string => {
	const minutes = Math.floor(seconds / 60)
	const remainingSeconds = seconds % 60

	const formattedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`
	const formattedSeconds =
		remainingSeconds < 10 ? `0${remainingSeconds}` : `${remainingSeconds}`

	return `${formattedMinutes}:${formattedSeconds}`
}

export const formatDate = (date: Date) => {
	return new Intl.DateTimeFormat("en-US", {
		day: "numeric",
		month: "short",
		hour: "numeric",
		minute: "numeric",
		hour12: true,
	}).format(date)
}

export const formatLongDate = (date: Date) => {
	const dateString = new Intl.DateTimeFormat("en-US", {
		day: "numeric",
		month: "short",
		year: "numeric",
	}).format(date)

	const timeString = new Intl.DateTimeFormat("en-US", {
		hour: "numeric",
		minute: "numeric",
		hour12: true,
	}).format(date)

	return `${dateString} • ${timeString}`
}
