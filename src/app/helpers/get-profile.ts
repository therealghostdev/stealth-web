"use server"

import { UserProps } from "@/types/profile"
import endpoints from "@/config/endpoints"
import { getAuthHeaders } from "@/shared/functions"
import { InvalidAuthenticatorError, InvalidProfileError } from "@/shared/error"

export const getProfile = async (): Promise<UserProps | Error> => {
	const session = await getAuthHeaders(false)
	if (!session) {
		return new InvalidAuthenticatorError("No session found")
	}

	const url = endpoints().user.profile
	const res = await fetch(url, {
		headers: session,
	})
	if (!res.ok) {
		return new InvalidProfileError("Failed to fetch user profile")
	}
	const profile = await res.json()

	return profile as UserProps
}

interface UpdateUserDto {
	firstName?: string
	lastName?: string
	login: string
}

export const updateProfile = async (
	payload: UpdateUserDto
): Promise<any | Error> => {
	const session = await getAuthHeaders()
	if (!session) {
		return new Error("No session found")
	}

	const url = endpoints().account["edit-profile"]
	const res = await fetch(url, {
		method: "POST",
		headers: session,
		body: JSON.stringify(payload),
	})
	if (!res.ok) {
		return new Error("Failed to update user profile")
	}
	const data = await res.json()
	return data
}
