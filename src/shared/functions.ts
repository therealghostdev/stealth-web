export const formatAmountForDisplay = (amount: string): string => {
	if (!amount) return ""
	const clean = amount.replace(/,/g, "")
	return new Intl.NumberFormat("en-US").format(Number(clean))
}
