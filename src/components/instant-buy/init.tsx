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
import CustomSwitch from "../shared/switch"
import { UserProps } from "@/types/profile"

interface Props {
	paymentConfig: UserProps["physicalWallets"] | []
	exchangeRate: ExchangeRateProps["data"]
	fields: {
		amount: string
		currency: string
		amountInSats: string
		walletAddress?: string
		walletId?: string
		usexpub: boolean
	}
	handleChange: (
		e:
			| React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
			| { target: { name: string; value: boolean } }
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
		const { amount, amountInSats, walletAddress, usexpub } = fields
		if (!amount) {
			return alert("Please enter amount!")
		}
		if (!walletAddress && !usexpub) {
			return alert("Please enter wallet address!")
		}
		setLoading(true)
		try {
			const isValidAddress = walletAddress && validateWalletAddress(walletAddress)
			if (!isValidAddress && walletAddress) {
				setError("Invalid wallet address!")
				setLoading(false)
				return
			}
			const res = await getPaymentDetails({
				amount: Number(amount),
				amountInSats,
				...(fields.usexpub
					? { walletId: String(props.paymentConfig[0]?.id) }
					: { walletAddress: fields.walletAddress }),
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
				Please enter description and your wallet address correctly
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
			{props.paymentConfig.length > 0 && (
				<>
					<div className="flex w-full items-center justify-between">
						<div className="flex items-center gap-x-2">
							<span>Use Xpub keys</span>
							<span>
								<WarningCircle className="text-alt-orange-100" />
							</span>
						</div>
						<div>
							<CustomSwitch
								checked={fields.usexpub}
								onCheckedChange={(checked) =>
									handleChange({
										target: { name: "usexpub", value: checked },
									})
								}
							/>
						</div>
					</div>
				</>
			)}
			<div className="relative my-6 mb-12 min-h-[100px]">
				<div
					className={`absolute inset-0 transition-all duration-300 ease-in-out ${
						fields.usexpub
							? "pointer-events-none translate-y-2 opacity-0"
							: "translate-y-0 opacity-100"
					}`}>
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
					<p className="text-xs">
						Please paste in your wallet address here. (Avoid reusing the same address
						for privacy reasons)
					</p>
				</div>

				<div
					className={`absolute inset-0 transition-all duration-300 ease-in-out ${
						fields.usexpub
							? "translate-y-0 opacity-100"
							: "pointer-events-none -translate-y-2 opacity-0"
					}`}>
					<p className="text-white" aria-label="x-pub-key">
						Xpub key <span className="text-[#B31919]">*</span>
					</p>
					<div className="flex flex-col gap-y-2 rounded-md border border-[#494949] bg-[#2B2B2B] px-2 py-5">
						<small className="text-[14px] text-[#AAAAAA]">
							{props.paymentConfig[0]?.alias}
						</small>
						<small className="text-[16px]">{props.paymentConfig[0]?.xpubKey}</small>
					</div>
				</div>
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
