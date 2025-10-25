"use server"
import { auth } from "@/auth"
import endpoints from "@/config/endpoints"
import { xpubInputProp } from "@/types/profile/index"

export const addXpub = async (payload: xpubInputProp) => {
	const session = await auth()
	if (!session) {
		return {
			message: "No session found",
			status: 401,
			success: false,
		}
	}
	const { accessToken } = session
	const url = endpoints().wallet.create
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
			message: "Failed to add xpub key!",
			status: res.status,
			success: false,
		}
	}
	return {
		message: "xpub key addition was successful!",
		status: res.status,
		success: true,
	}
}

export const updateXpub = async (
	id: string | number,
	payload: Omit<xpubInputProp, "alias">
) => {
	const session = await auth()
	if (!session) {
		return {
			message: "No session found",
			status: 401,
			success: false,
		}
	}
	const { accessToken } = session
	const url = endpoints(id).wallet.update
	const res = await fetch(url, {
		method: "PUT",
		body: JSON.stringify(payload),
		headers: {
			Authorization: `Bearer ${accessToken}`,
			"Content-Type": "application/json",
		},
	})
	if (!res.ok) {
		return {
			message: "Failed to update xpub key!",
			status: res.status,
			success: false,
		}
	}
	return {
		message: "xpub key update was successful!",
		status: res.status,
		success: true,
	}
}
export const deleteXpub = async (id: string | number) => {
	const session = await auth()
	if (!session) {
		return {
			message: "No session found",
			status: 401,
			success: false,
		}
	}
	const { accessToken } = session
	const url = endpoints(id).wallet.delete
	const res = await fetch(url, {
		method: "DELETE",
		headers: {
			Authorization: `Bearer ${accessToken}`,
			"Content-Type": "application/json",
		},
	})
	if (!res.ok) {
		return {
			message: "Failed to delete xpub key!",
			status: res.status,
			success: false,
		}
	}
	return {
		message: "xpub key delete was successful!",
		status: res.status,
		success: true,
	}
}
