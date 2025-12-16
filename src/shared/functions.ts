import { ApiResponse } from "@/types/kyc"
import { auth } from "@/auth"
import jwtDecode from "jwt-decode"
import { Session } from "next-auth"

type JwtPayload = { exp: number }
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

export const verifyAuthTokenExpiry = async (
	value: Session | null
): Promise<boolean> => {
	let shouldRedirect = false
	if (!value || !value?.accessToken) {
		shouldRedirect = true
	} else {
		try {
			const decoded = jwtDecode<JwtPayload>(value?.accessToken)
			shouldRedirect = decoded.exp * 1000 <= Number(new Date())
		} catch {
			shouldRedirect = true
		}
	}

	return shouldRedirect
}
