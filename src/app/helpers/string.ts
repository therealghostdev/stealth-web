export const formatBtcAddress = (walletAddress: string) => {
	const firstPart = walletAddress.slice(0, 8)
	const lastPart = walletAddress.slice(-6)
	return `${firstPart}...${lastPart}`
}
