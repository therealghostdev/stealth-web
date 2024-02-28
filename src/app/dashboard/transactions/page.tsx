import { getTransactions } from "@/app/helpers/get-transactions"
import TransactionsTable from "@/components/transactions-table"
import Form from "./form"

const Page = async () => {
	const transactions = await getTransactions()

	if (transactions instanceof Error) {
		return (
			<div className="flex h-screen flex-col items-center justify-center">
				<h1 className="mt-4 font-satoshi text-lg font-bold">
					Failed to fetch transactions!
				</h1>
				<p className="mt-2 text-sm text-gray-500">{transactions.message}</p>
			</div>
		)
	}

	return (
		<div className="w-full">
			<div className="mb-6 flex w-full items-center justify-between">
				<p className="font-satoshi text-2xl font-bold capitalize">Transactions</p>
				<Form />
			</div>
			<TransactionsTable transactions={transactions} />
		</div>
	)
}

export default Page
