type SpinnerProps = {
	size?: "small" | "large"
}

const Spinner = ({ size = "small" }: SpinnerProps) => {
	const height = size === "small" ? "h-6" : "h-16"
	const width = size === "small" ? "w-6" : "w-16"
	const borderTop = size === "small" ? "border-t-2" : "border-t-4"

	return (
		<div
			className={`${height} ${width} border ${borderTop} animate-spin rounded-full border-solid border-green-300`}></div>
	)
}

export default Spinner
