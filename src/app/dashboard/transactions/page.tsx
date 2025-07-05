import TransactionsTable from "@/components/transactions-table"
import Form from "./form"
import { getAllPaymentDetails } from "@/app/helpers/get-price"
import FilteredTransactions from "./filteredTransactions"

export default async function Page() {
	const transactionsRes = await getAllPaymentDetails()

	if (transactionsRes instanceof Error) {
		return (
			<div className="flex h-screen flex-col items-center justify-center">
				<h1 className="mt-4 font-satoshi text-lg font-bold">
					Failed to fetch transactions!
				</h1>
				<p className="mt-2 text-sm text-gray-500">{transactionsRes.message}</p>
			</div>
		)
	}

	return <FilteredTransactions initialTransactions={transactionsRes.data} />
}
