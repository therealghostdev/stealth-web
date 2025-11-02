import { ApiResponse } from "@/types/kyc"
import { auth } from "@/auth"

export const formatAmountForDisplay = (amount: string): string => {
	if (!amount) return ""
	const clean = amount.replace(/,/g, "")
	return new Intl.NumberFormat("en-US").format(Number(clean))
}

export const createResponse = (
	message: string,
	status: number,
	success: boolean
): ApiResponse => ({
	message,
	status,
	success,
})

export const getAuthHeaders = async (isJson: boolean = true) => {
	const session = await auth()
	if (!session) return null

	const { accessToken } = session

	const baseHeaders: Record<string, string> = {
		Authorization: `Bearer ${accessToken}`,
	}

	if (isJson) baseHeaders["Content-Type"] = "application/json"

	return baseHeaders
}
