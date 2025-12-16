"use server"

import endpoints from "@/config/endpoints"
import { auth } from "@/auth"
import {
	ExchangeRateProps,
	PaymentDetail,
	PaymentDetailsProps,
	PaymentStatusProps,
	fetchMeta,
} from "@/types/price"
import { getAuthHeaders } from "@/shared/functions"

export const getExchangeRate = async (): Promise<ExchangeRateProps | Error> => {
	const session = await getAuthHeaders(false)
	if (!session) {
		return new Error("No session found!")
	}
	const url = endpoints().price.btc
	const response = await fetch(url, {
		headers: session,
		// revalidate data every 30 seconds
		next: { revalidate: 30, tags: ["price"] },
	})
	if (!response.ok) {
		return new Error("Failed to fetch exchange rate!")
	}
	const data = await response.json()
	return data as ExchangeRateProps
}

interface PaymentPayload {
	amount: string | number
	walletAddress?: string
	walletId?: string
	amountInSats?: string | number
	narration?: string
	generatePaymentLink?: boolean
}

export const getPaymentDetails = async (
	payload: PaymentPayload
): Promise<PaymentDetailsProps> => {
	const session = await getAuthHeaders()
	if (!session) {
		throw new Error("No session found!")
	}
	const url = endpoints().payment["get-details"]
	const response = await fetch(url, {
		method: "POST",
		body: JSON.stringify(payload),
		headers: session,
		next: { revalidate: 60, tags: ["paid"] },
	})
	const data = await response.json()
	console.log(data, " is data");
	if (!response.ok) {
		throw new Error(data?.message || "Failed to fetch payment details!")
	}
	return data
}

export const getAllPaymentDetails = async (): Promise<
	fetchMeta & { data: PaymentDetail[] }
> => {
	const session = await getAuthHeaders()
	if (!session) {
		throw new Error("No session found!")
	}
	const url = endpoints().payment.list
	const response = await fetch(url, {
		method: "GET",
		headers: session,
		next: { revalidate: 10, tags: ["paid", "approved"] },
	})
	if (!response.ok) {
		throw new Error("Failed to fetch payment details!")
	}
	const data = await response.json()
	return data as fetchMeta & { data: PaymentDetail[] }
}

export const confirmPayment = async (
	referenceNumber: string
): Promise<PaymentStatusProps | Error> => {
	const session = await getAuthHeaders()
	if (!session) {
		return new Error("No session found!")
	}
	const url = endpoints().payment["get-status"]
	const response = await fetch(url, {
		method: "POST",
		body: JSON.stringify({ referenceNumber }),
		headers: session,
	})
	if (!response.ok) {
		return new Error("Failed to fetch payment details!")
	}
	const data = await response.json()
	return data as PaymentStatusProps
}
