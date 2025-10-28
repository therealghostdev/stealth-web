"use server"

import endpoints from "@/config/endpoints"
import { getAuthHeaders } from "@/shared/functions"
import { createResponse } from "@/shared/functions"

interface ChangePasswordPayload {
	currentPassword: string
	newPassword: string
}

export const changePassword = async (payload: ChangePasswordPayload) => {
	const session = await getAuthHeaders()
	if (!session) {
		return createResponse("No session found", 401, false)
	}

	const url = endpoints().auth["change-password"]
	const res = await fetch(url, {
		method: "POST",
		body: JSON.stringify(payload),
		headers: session,
	})
	if (!res.ok) {
		return createResponse("Failed to change password", res.status, false)
	}
	return createResponse("Password changed successfully!", res.status, true)
}
