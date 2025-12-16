"use client"

import { ArrowsDownUp, Copy, WarningCircle } from "@phosphor-icons/react"
import {
	Dispatch,
	SetStateAction,
	useCallback,
	useEffect,
	useState,
} from "react"

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
import { XpubSelect } from "../xpubSelect"

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
	const [buttonDisableld, setButtonDisabled] = useState(false)
	const { fields, handleChange } = props
	const [selectedWalletId, setSelectedWalletId] = useState<number | null>(null)

	const handleSubmit = async () => {
		const { amount, amountInSats, walletAddress, usexpub } = fields

		const cleanAmount = amount.replace(/,/g, "")
		const numericAmount = parseFloat(cleanAmount)
		const numericAmountInSats = parseFloat(amountInSats)

		if (!amount || isNaN(numericAmount) || numericAmount <= 0) {
			return alert("Please enter amount!")
		}

		if (isNaN(numericAmountInSats)) {
			return alert("Invalid amount in sats!")
		}

		if (!walletAddress && !usexpub) {
			setError("Please enter a wallet address")
			return
		}
		setButtonDisabled(false)
		setLoading(true)
		try {
			const res = await getPaymentDetails({
				amount: numericAmount,
				amountInSats: numericAmountInSats,
				...(fields.usexpub
					? {
							walletId:
								props.paymentConfig.length === 1
									? String(props.paymentConfig[0]?.id)
									: String(selectedWalletId),
					  }
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

	const validate = useCallback((value: string) => {
		const isValidAddress = value && validateWalletAddress(value)

		if (!isValidAddress && value) {
			setButtonDisabled(true)
			setError("Invalid wallet address!")
		} else {
			setButtonDisabled(false)
			setError("")
		}
	}, [])

	useEffect(() => {
		const { walletAddress, usexpub } = fields

		if (!usexpub && walletAddress) {
			validate(walletAddress)
		} else if (usexpub) {
			setButtonDisabled(false)
			setError("")
		}
	}, [fields, validate])

	// when amount field is being edited
	useEffect(() => {
		if (reversed) return

		if (!fields.amount || fields.amount === "" || fields.amount === "0") {
			props.setAmountInSats("0")
			return
		}

		const cleanAmount = fields.amount.replace(/,/g, "")
		const numericAmount = parseFloat(cleanAmount)

		if (isNaN(numericAmount) || !isFinite(numericAmount)) {
			props.setAmountInSats("0")
			return
		}

		const { amountInSats } = getCurrencyValue({
			amount: cleanAmount,
			pricePerSat: props.exchangeRate.pricePerSat,
			pricePerUsd: props.exchangeRate.pricePerUsd,
		})

		if (!isNaN(amountInSats) && isFinite(amountInSats)) {
			props.setAmountInSats(Math.floor(amountInSats).toString())
		} else {
			props.setAmountInSats("0")
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [fields.amount, reversed])

	// when sats field is being edited
	useEffect(() => {
		if (!reversed) return

		if (
			!fields.amountInSats ||
			fields.amountInSats === "" ||
			fields.amountInSats === "0"
		) {
			handleChange({ target: { name: "amount", value: "0" } } as any)
			return
		}

		const cleanSats = fields.amountInSats.replace(/,/g, "")
		const numericSats = parseFloat(cleanSats)

		if (isNaN(numericSats) || !isFinite(numericSats)) {
			handleChange({ target: { name: "amount", value: "0" } } as any)
			return
		}

		const amountInNaira = numericSats * props.exchangeRate.pricePerSat

		if (!isNaN(amountInNaira) && isFinite(amountInNaira)) {
			handleChange({
				target: { name: "amount", value: amountInNaira.toString() },
			} as any)
		} else {
			handleChange({ target: { name: "amount", value: "0" } } as any)
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [fields.amountInSats, reversed])

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
					{error && !fields.usexpub && (
						<small className="text-[#B31919]">{error}</small>
					)}
					<p className="text-xs">
						Please paste in your wallet address here. (Avoid reusing the same address
						for privacy reasons)
					</p>
				</div>

				{fields.usexpub && props.paymentConfig.length === 1 && (
					<div
						className={`absolute inset-0 transition-all duration-300 ease-in-out ${
							fields.usexpub
								? "translate-y-0 opacity-100"
								: "pointer-events-none -translate-y-2 opacity-0"
						}`}>
						<p className="text-white" aria-label="x-pub-key">
							Xpub key <span className="text-[#B31919]">*</span>
						</p>
						<div className="flex flex-col gap-y-2 rounded-md border border-[#494949] bg-[#2B2B2B] px-2 py-5 font-satoshi">
							<small className="text-[14px] text-[#AAAAAA]">
								{props.paymentConfig[0]?.alias}
							</small>
							<small className="truncate text-[16px]">
								{props.paymentConfig[0]?.xpubKey}
							</small>
						</div>
						{fields.usexpub && error && (
							<small className="mt-2 block text-[#B31919]">{error}</small>
						)}
					</div>
				)}

				{fields.usexpub && props.paymentConfig.length > 1 && (
					<div
						className={`flex w-full flex-col gap-1 ${
							fields.usexpub ? "translate-y-0 opacity-100" : "-translate-y-2 opacity-0"
						}`}>
						<label className="text-white mb-2 block text-sm font-medium">
							Enter Xpub <span className="text-[#B31919]">*</span>
						</label>
						<XpubSelect
							items={props.paymentConfig}
							value={selectedWalletId}
							onValueChange={(id) => {
								setSelectedWalletId(id)
							}}
							placeholder="Select Xpub"
						/>
					</div>
				)}
			</div>

			<div className="pb-10">
				<Button
					type="button"
					onClick={handleSubmit}
					disabled={buttonDisableld}
					width="w-full">
					{loading ? <Spinner /> : "Buy Now"}
				</Button>
			</div>
		</div>
	)
}

export default Init
