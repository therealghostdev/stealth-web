"use client"

import { ArrowsDownUp, Copy, WarningCircle } from "@phosphor-icons/react"
import { Dispatch, SetStateAction, useEffect, useState } from "react"

import { formatCurrency, getCurrencyValue } from "@/app/helpers/amount"
import { getPaymentDetails } from "@/app/helpers/get-price"
import { CurrencyInput } from "@/components/shared/input"
import { Button, Input, Spinner } from "@/components"
import { ExchangeRateProps, PaymentDetailsProps } from "@/types/price"
import { validateWalletAddress } from "@/app/helpers/address"
import { PaymentDetails } from "."
import { formatAmountForDisplay } from "@/shared/functions"
import { Cross1Icon } from "@radix-ui/react-icons"

interface Props {
	exchangeRate: ExchangeRateProps["data"]
	fields: {
		amount: string
		currency: string
		amountInSats: string
		narration?: string
		walletAddress: string
	}
	handleChange: (
		e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
	) => void
	pasteWalletAddress: () => void
	setAmountInSats: (value: string) => void
	setDepositInfo: Dispatch<SetStateAction<PaymentDetails>>
	next: () => void
	close: () => void
}

const CurrencyList = ["NGN", "SATS"] // removed USD for now

const Init = (props: Props) => {
	const [reversed, setReversed] = useState(false)
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState("")
	const [displayAmount, setDisplayAmount] = useState("")
	const [displayAmount1, setDisplayAmount1] = useState("")
	const { fields, handleChange } = props

	const handleSubmit = async () => {
		const { amount, amountInSats, narration, walletAddress } = fields
		if (!amount) {
			return alert("Please enter amount!")
		}
		if (!walletAddress) {
			return alert("Please enter wallet address!")
		}
		setLoading(true)
		try {
			const isValidAddress = validateWalletAddress(walletAddress)
			if (!isValidAddress) {
				setError("Invalid wallet address!")
				setLoading(false)
				return
			}
			const res = await getPaymentDetails({
				amount: Number(amount),
				amountInSats,
				walletAddress,
				narration,
			})
			if (res instanceof Error) {
				setError(res.message)
				setLoading(false)
			}
			props.setDepositInfo(res.data)
			props.next()
		} catch (error) {
			if (error instanceof Error) {
				setError(error.message)
				setLoading(false)
			}
		}
	}

	useEffect(() => {
		const { amountInSats } = getCurrencyValue({
			amount: fields.amount,
			pricePerSat: props.exchangeRate.pricePerSat,
			pricePerUsd: props.exchangeRate.pricePerUsd,
		})
		props.setAmountInSats(amountInSats.toString())
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [fields.amount])

	useEffect(() => {
		setDisplayAmount(formatAmountForDisplay(fields.amount))
		setDisplayAmount1(formatAmountForDisplay(fields.amountInSats))
	}, [fields.amount, fields.amountInSats])

	return (
		<div className="h-full w-full">
			<button
				type="button"
				onClick={props.close}
				className="hover:text-white absolute right-4 top-4 text-red-100"
				aria-label="Close">
				<Cross1Icon fontSize={32} />
			</button>
			<p className="font-satoshi text-[28px] font-medium">Instant Buy</p>
			<p className="text-lg text-black-400">
				Please enter narration and your wallet address correctly
			</p>
			<div className="my-8 flex w-full flex-col">
				<div
					className={`flex w-full ${reversed ? "flex-col-reverse" : "flex-col"}`}>
					<CurrencyInput
						amount={displayAmount}
						currency={fields.currency}
						inputName="amount"
						selectName="currency"
						handleAmountChange={handleChange}
						handleCurrencyChange={handleChange}>
						{CurrencyList.map((currency) => (
							<option key={currency} value={currency}>
								{currency}
							</option>
						))}
					</CurrencyInput>
					<div className="relative h-4 w-full">
						<button
							title="swap"
							onClick={() => setReversed(!reversed)}
							className="absolute left-[3%] top-1/2 grid aspect-square w-8 -translate-y-1/2 place-items-center rounded-full border bg-[#111]">
							<ArrowsDownUp size={20} />
						</button>
					</div>
					<CurrencyInput
						amount={displayAmount1}
						currency="SATS"
						inputName="amountInSats"
						disableInput={!reversed}
						disableSelect
						handleAmountChange={handleChange}
						handleCurrencyChange={handleChange}>
						{CurrencyList.map((currency) => (
							<option key={currency} value={currency}>
								{currency}
							</option>
						))}
					</CurrencyInput>
				</div>
				<p className="flex items-center gap-1 text-xs text-black-400">
					<WarningCircle className="text-alt-orange-100" />
					Exchange rate: 1BTC = {formatCurrency(props.exchangeRate.pricePerBtc)}
				</p>
			</div>
			<div className="my-6">
				<Input
					typed="text"
					name="walletAddress"
					value={fields.walletAddress}
					onChange={handleChange}
					label="Wallet Address"
					pasteBtn={
						<button
							type="button"
							onClick={props.pasteWalletAddress}
							className="flex items-center gap-1 px-2 text-xs uppercase text-green-100">
							paste <Copy size={14} />
						</button>
					}
				/>
				<p className="text-xs">Please paste in your wallet address here</p>
			</div>
			<div className="mb-10 mt-6">
				<Input
					typed="text"
					name="Description"
					value={fields.narration}
					onChange={handleChange}
					label="Narration"
				/>
			</div>
			<div className="pb-10">
				<Button
					type="button"
					onClick={handleSubmit}
					disabled={loading}
					width="w-full">
					{loading ? <Spinner /> : "Buy Now"}
				</Button>
			</div>
		</div>
	)
}

export default Init
