"use server"
import { getAuthHeaders } from "@/shared/functions"
import endpoints from "@/config/endpoints"
import { xpubInputProp } from "@/types/profile/index"
import { createResponse } from "@/shared/functions"

export const addXpub = async (payload: xpubInputProp) => {
	const session = await getAuthHeaders()
	if (!session) {
		return createResponse("No session found", 401, false)
	}

	const url = endpoints().wallet.create
	const res = await fetch(url, {
		method: "POST",
		body: JSON.stringify(payload),
		headers: session,
	})
	if (!res.ok) {
		return createResponse("Failed to add xpub key", res.status, false)
	}
	return createResponse("xpub key addition was successful!", res.status, true)
}

export const updateXpub = async (
	id: string | number,
	payload: Omit<xpubInputProp, "alias">
) => {
	const session = await getAuthHeaders()
	if (!session) {
		return createResponse("No session found", 401, false)
	}

	const url = endpoints(id).wallet.update
	const res = await fetch(url, {
		method: "PUT",
		body: JSON.stringify(payload),
		headers: session,
	})
	if (!res.ok) {
		return createResponse("Failed to update xpub key!", res.status, false)
	}
	return createResponse("xpub key update was successful!", res.status, true)
}
export const deleteXpub = async (id: string | number) => {
	const session = await getAuthHeaders()
	if (!session) {
		return createResponse("No session found", 401, false)
	}

	const url = endpoints(id).wallet.delete
	const res = await fetch(url, {
		method: "DELETE",
		headers: session,
	})
	if (!res.ok) {
		return createResponse("failed to delete xpub key", res.status, false)
	}
	return createResponse("xpub key delete was successful!", res.status, true)
}
