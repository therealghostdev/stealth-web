"use server"

import endpoints from "@/config/endpoints"
import { auth } from "@/auth"

interface ChangePasswordPayload {
	currentPassword: string
	newPassword: string
}

export const changePassword = async (payload: ChangePasswordPayload) => {
	const session = await auth()
	if (!session) {
		return {
			message: "No session found",
			status: 401,
			success: false,
		}
	}
	const { accessToken } = session
	const url = endpoints().auth["change-password"]
	const res = await fetch(url, {
		method: "POST",
		body: JSON.stringify(payload),
		headers: {
			Authorization: `Bearer ${accessToken}`,
			"Content-Type": "application/json",
		},
	})
	if (!res.ok) {
		return {
			message: "Failed to change password!",
			status: res.status,
			success: false,
		}
	}
	return {
		message: "Password changed successfully!",
		status: res.status,
		success: true,
	}
}
