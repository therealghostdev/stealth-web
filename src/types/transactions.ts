export type TransactionProps = {
	id: string
	userId: 852
	paymentId: 1107
	walletAddress: string
	transactionStatus: "PROCESSING" | "PENDING" | "SUCCESSFUL" | "FAILED"
	transactionReference: string
	processorId: string
	createdDate: Date | string
	amount: string
	value: string
}
