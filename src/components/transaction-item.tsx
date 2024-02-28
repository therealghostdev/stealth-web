"use client"

import {
	CheckCircle,
	WarningCircle,
	WarningOctagon,
} from "@phosphor-icons/react"
import React from "react"

import { TransactionProps } from "@/types/transactions"
import { formatCurrency } from "@/app/helpers/amount"
import { formatLongDate } from "@/app/helpers/time"

interface Props {
	transaction: TransactionProps
}

const StatusColor = {
	SUCCESSFUL: "text-green-100",
	IN_PROGRESS: "text-orange-100",
	PENDING: "text-orange-100",
	FAILED: "text-red-100",
}

const StatusIcon = {
	SUCCESSFUL: <CheckCircle className="text-9xl text-green-100" weight="fill" />,
	IN_PROGRESS: (
		<WarningOctagon className="text-9xl text-orange-100" weight="fill" />
	),
	PENDING: <WarningOctagon className="text-9xl text-orange-100" weight="fill" />,
	FAILED: <WarningCircle className="text-9xl text-red-100" weight="fill" />,
}

const TransactionItem = ({ transaction }: Props) => {
	return (
		<div className="flex w-full flex-col items-center gap-5">
			{StatusIcon[transaction.transactionStatus]}
			<p className="text-xl text-white-300">You purchased</p>
			<p className="text-[28px] text-white-100">{transaction.value} BTC</p>
			<div className="flex w-full items-center justify-between">
				<div className="flex flex-col">
					<p className="text-sm text-white-300">Transaction ID</p>
					<p className="text-xl font-medium text-white-100">
						{transaction.transactionReference}
					</p>
				</div>
				<p
					className={`text-xl capitalize ${
						StatusColor[transaction.transactionStatus]
					}`}>
					{transaction.transactionStatus.toLowerCase().split("_").join(" ")}
				</p>
			</div>
			<div className="flex w-full flex-col justify-start">
				<p className="text-sm text-white-300">Date</p>
				<p className="text-xl font-medium text-white-100">
					{formatLongDate(new Date(transaction.createdDate))}
				</p>
			</div>
			<div className="w-full">
				<div className="flex w-full items-center justify-between text-sm text-white-300">
					<p>Amount</p>
					<p>Value</p>
				</div>
				<div className="flex w-full items-center justify-between text-xl font-medium">
					<p>{formatCurrency(+transaction.amount || 0)}</p>
					<p>{transaction.value || 0} BTC</p>
				</div>
			</div>
			<div className="flex w-full flex-col justify-start">
				<p className="text-sm text-white-300">Network Fee</p>
				<p className="text-xl font-medium text-white-100">{formatCurrency(0)}</p>
			</div>
			<hr className="my-4 w-full" />
			<div className="flex w-full flex-col justify-start">
				<p className="text-sm text-white-300">Wallet Address</p>
				<p className="text-xl font-medium text-white-100">
					{transaction.walletAddress}
				</p>
			</div>
			<div className="flex w-full flex-col justify-start">
				<p className="text-sm text-white-300">Transaction Hash</p>
				<p className="text-xl font-medium text-white-100">{}</p>
			</div>
		</div>
	)
}

export default TransactionItem
