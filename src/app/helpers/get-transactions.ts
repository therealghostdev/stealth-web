"use server"
import { TransactionProps } from "@/types/transactions"
import endpoints from "@/config/endpoints"
import { auth } from "@/auth"

export const getTransactions = async (): Promise<
	TransactionProps[] | Error
> => {
	const session = await auth()
	if (!session) {
		return new Error("No session found!")
	}
	const { accessToken } = session
	const url = endpoints().transactions.list
	const response = await fetch(url, {
		headers: {
			Authorization: `Bearer ${accessToken}`,
		},
	})
	if (!response.ok) {
		return new Error("Failed to fetch exchange rate!")
	}
	const data = await response.json()
	return data as TransactionProps[]
}

export const getTransactionById = async (
	id: string
): Promise<TransactionProps | Error> => {
	const session = await auth()
	if (!session) {
		return new Error("No session found!")
	}
	const { accessToken } = session
	const url = endpoints(id).transactions["get-by-id"]
	const response = await fetch(url, {
		headers: {
			Authorization: `Bearer ${accessToken}`,
		},
	})
	if (!response.ok) {
		return new Error("Failed to fetch exchange rate!")
	}
	const data = await response.json()
	return data as TransactionProps
}
