"use client"
import { useState, useMemo } from "react"
import TransactionsTable from "@/components/transactions-table"
import Form from "./form"
import { PaymentDetail } from "@/types/price"

export default function FilteredTransactions({
	initialTransactions,
}: {
	initialTransactions: PaymentDetail[]
}) {
	const [query, setQuery] = useState("")
	const filteredTransactions = useMemo(() => {
		if (!query) return initialTransactions

		const lower = query.toLowerCase().trim()
		const cleanQuery = lower.replace(/,/g, "") // remove commas from query

		return initialTransactions.filter((tx) => {
			const createdDate = new Date(tx.createdDate)

			// Date parts
			const day = String(createdDate.getDate())
			const monthName = createdDate
				.toLocaleString("default", { month: "long" })
				.toLowerCase()
			const shortMonth = createdDate
				.toLocaleString("default", { month: "short" })
				.toLowerCase()
			const dateStr = createdDate.toISOString().split("T")[0]

			// Amounts
			const rawAmount = String(tx.amount)
			const formattedAmount = (+tx.amount).toLocaleString()
			const formattedAmountNoComma = formattedAmount.replace(/,/g, "")

			// Possible date patterns
			const datePatterns = [
				`${day} ${monthName}`,
				`${monthName} ${day}`,
				`${day} ${shortMonth}`,
				`${shortMonth} ${day}`,
			]

			return (
				monthName.includes(lower) ||
				shortMonth.includes(lower) ||
				dateStr.includes(lower) ||
				datePatterns.some((pattern) => pattern.includes(lower)) ||
				rawAmount.includes(cleanQuery) ||
				formattedAmountNoComma.includes(cleanQuery)
			)
		})
	}, [query, initialTransactions])

	return (
		<div className="h-4/5 w-full">
			<div className="mb-6 flex w-full flex-col items-center justify-between lg:flex-row">
				<p className="font-satoshi text-2xl font-bold capitalize">Transactions</p>
				<Form query={query} setQuery={setQuery} />
			</div>
			<TransactionsTable transactions={filteredTransactions} />
		</div>
	)
}
