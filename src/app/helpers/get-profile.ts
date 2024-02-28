"use server"

import { UserProps } from "@/types/profile"
import endpoints from "@/config/endpoints"
import { auth } from "@/auth"
import jwtDecode from "jwt-decode"
import { DecodedJwt } from "@/types/jwt"
import {
	ExpiredSessionError,
	InvalidAuthenticatorError,
	InvalidProfileError,
} from "@/shared/error"

export const getProfile = async (): Promise<UserProps | Error> => {
	const session = await auth()
	if (!session) {
		return new InvalidAuthenticatorError("No session found")
	}
	const { accessToken } = session
	if (!accessToken) {
		return new InvalidAuthenticatorError("No access token found")
	}
	const decoded: DecodedJwt = jwtDecode(accessToken)
	if (!decoded) {
		return new InvalidAuthenticatorError("Failed to decode access token")
	}
	const tokenExpiryTime = new Date(decoded?.exp * 1000)
	if (tokenExpiryTime < new Date()) {
		return new ExpiredSessionError("Session expired")
	}
	const url = endpoints().user.profile
	const res = await fetch(url, {
		headers: {
			Authorization: `Bearer ${accessToken}`,
		},
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
	const session = await auth()
	if (!session) {
		return new Error("No session found")
	}
	const { accessToken } = session
	const url = endpoints().account["edit-profile"]
	const res = await fetch(url, {
		method: "POST",
		headers: {
			Authorization: `Bearer ${accessToken}`,
			"Content-Type": "application/json",
		},
		body: JSON.stringify(payload),
	})
	if (!res.ok) {
		return new Error("Failed to update user profile")
	}
	const data = await res.json()
	return data
}
