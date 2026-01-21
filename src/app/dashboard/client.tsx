"use client"
import { WarningCircle } from "@phosphor-icons/react"
import { useEffect, useState } from "react"

import { TableBody, TableHead } from "@/components/transactions-table"
import { CurrencyInput } from "@/components/shared/input"
import { formatCurrency, formatDigits } from "../helpers/amount"
import InstantBuy from "@/components/instant-buy"
import { ExchangeRateProps, PaymentDetail } from "@/types/price"
import { INT_REGEX } from "@/config/constants"
import { Button, Dialog } from "@/components"
import { UserProps } from "@/types/profile"
import GeneratePayLink from "@/components/generateLink"
import Start from "@/components/kyc/start"
import { formatAmountForDisplay } from "@/shared/functions"
import BtcPriceChart from "@/components/btcPriceChart"

const CurrencyList = ["NGN"] // just ngn for now

interface Props {
	exchangeRate: ExchangeRateProps
	profile: UserProps
	transactions: PaymentDetail[]
}

const Client = ({ exchangeRate: { data }, profile, transactions }: Props) => {
	const [fields, setFields] = useState({ amount: "", currency: "NGN" })
	const [openModal, setOpenModal] = useState(false)
	const [openGenerateModal, setOpenGenerateModal] = useState(false)
	const [error, setError] = useState("")
	const [kycScreen, setKycScreen] = useState<0 | 1 | 2 | 3>(0)
	const displayAmount = formatAmountForDisplay(fields.amount)
	const paymentConfig = profile.physicalWallets

	const displayName = profile.firstName
		? profile.firstName
		: profile.email.split("@")[0]

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
	) => {
		const { name, value } = e.target

		if (name === "amount") {
			const cleanValue = value.replace(/\D/g, "")
			setFields({ ...fields, [name]: cleanValue })
			return
		}
		setFields({ ...fields, [name]: value })
	}

	const handleSubmit1 = async () => {
		const { amount } = fields

		const cleanAmount = amount.replace(/[^\d]/g, "")

		if (Number(cleanAmount) <= 0) {
			return setError("Please enter an amount greater than 0!")
		}
		//checks if the amount includes only integers to avoid exponential notation e.g 3.9e10
		if (!INT_REGEX.test(amount)) {
			return setError("Please enter a valid amount!")
		}
		setOpenModal(true)
	}

	const handleSubmit2 = async () => {
		const { amount } = fields

		const cleanAmount = amount.replace(/[^\d]/g, "")

		if (Number(cleanAmount) <= 0) {
			return setError("Please enter an amount greater than 0!")
		}
		//checks if the amount includes only integers to avoid exponential notation e.g 3.9e10
		if (!INT_REGEX.test(amount)) {
			return setError("Please enter a valid amount!")
		}
		setOpenGenerateModal(true)
	}

	const closeModal = () => {
		setOpenModal(false)
		setOpenGenerateModal(false)
		setFields({ ...fields, amount: "" })
	}

	useEffect(() => {
		const timeout = setTimeout(() => {
			setError("")
		}, 5000)
		return () => clearTimeout(timeout)
	}, [error])

	const IncreaseKycProgress = () => {
		setKycScreen((prev) => {
			if (prev < 3) return (prev + 1) as 0 | 1 | 2 | 3
			return prev
		})
	}

	const reduceKycProgress = () => {
		setKycScreen((prev) => {
			if (prev !== 0) return (prev - 1) as 0 | 1 | 2 | 3
			return prev
		})
	}

	return (
		<>
			{(profile.kycInfo.level === "ONE" ||
				((profile.kycInfo.level === "TWO" || profile.kycInfo.level === "THREE") &&
					profile.physicalWallets.length === 0)) && (
				<section>
					<Start
						open={openModal}
						setOpen={closeModal}
						setKycProgress={IncreaseKycProgress}
						kycProgress={kycScreen}
						paymentConfig={paymentConfig}
						kycInfo={profile.kycInfo}
						reverseKycProgress={reduceKycProgress}
					/>
				</section>
			)}

			{kycScreen === 0 && (
				<>
					<Dialog isOpen={openModal} onDismiss={closeModal}>
						<InstantBuy
							paymentConfig={paymentConfig}
							amount={fields.amount}
							currency={fields.currency}
							exchangeRate={data}
							dismiss={closeModal}
						/>
					</Dialog>

					<Dialog isOpen={openGenerateModal} onDismiss={closeModal}>
						<GeneratePayLink
							amount={fields.amount}
							currency={fields.currency}
							exchangeRate={data}
							dismiss={closeModal}
						/>
					</Dialog>
					<div className="flex w-full flex-col gap-6">
						<p className="font-satoshi text-2xl font-bold capitalize">
							Hello {displayName},
						</p>
						<div className="grid h-[350px] w-full grid-cols-5 gap-6 md:mb-12">
							<div className="col-span-6 flex h-full flex-col justify-between rounded-lg border border-black-500 bg-black-700 p-6 md:col-span-2 lg:col-span-2">
								<div>
									<p className="font-satoshi text-xl font-medium">Instant Buy</p>
									<p className="mb-4 text-xs text-black-400">
										Instantly buy Bitcoin into your self custody hardware wallet. Remember
										it&apos;s not your Bitcoin until you self-custody it.
									</p>
									<CurrencyInput
										disableInput={profile.kycInfo.level === "ONE"}
										amount={displayAmount}
										currency={fields.currency}
										inputName="amount"
										label="Enter Amount"
										selectName="currency"
										handleAmountChange={handleChange}
										handleCurrencyChange={handleChange}
										error={error}>
										{CurrencyList.map((currency) => (
											<option key={currency} value={currency}>
												{currency}
											</option>
										))}
									</CurrencyInput>
									{Number(fields.amount) > profile.kycInfo.maxAmount ? (
										(profile.kycInfo.level === "ONE" ||
											profile.kycInfo.level === "TWO") && (
											<p className="flex items-center gap-1 text-xs text-red-100">
												<WarningCircle className="text-red-100" />
												Upgrade your KYC to buy BTC above{" "}
												{formatDigits(profile.kycInfo.maxAmount)}.
											</p>
										)
									) : Number(fields.amount) < profile.kycInfo.minAmount ? (
										<p className="flex items-center gap-1 text-xs text-red-100">
											<WarningCircle className="text-red-100" />
											Due to dust transactions, your purchase must be{" "}
											{formatDigits(profile.kycInfo.minAmount)} or higher.
										</p>
									) : null}

									<p className="flex items-center gap-1 text-xs text-black-400">
										<WarningCircle className="text-alt-orange-100" />
										Exchange rate: 1 BTC = {formatCurrency(data.pricePerBtc)}
									</p>
								</div>
								<div className="grid w-full gap-6">
									{!true && (
										<Button
											type="button"
											onClick={handleSubmit2}
											width="w-full bg-black-600"
											disabled={true}>
											Generate Payment Link
										</Button>
									)}
									<Button
										type="button"
										disabled={
											profile.kycInfo.level === "ONE" ||
											(profile.kycInfo.level === "TWO" &&
												Number(fields.amount) < profile.kycInfo.minAmount)
										}
										onClick={handleSubmit1}
										// width="w-full"
										style={{ width: "100%" }}>
										Buy Now
									</Button>
								</div>
							</div>
							<div className="hidden h-full items-center justify-center rounded-lg border border-black-500 bg-black-700 md:col-span-3 md:flex lg:col-span-3">
								<BtcPriceChart />
							</div>
						</div>
						<div className="flex h-auto w-full flex-col rounded-lg border border-black-500 bg-black-700 p-6">
							<div className="flex items-center">
								<p className="font-satoshi text-xl font-medium">Recent Transactions</p>
							</div>
							<hr className="my-4 w-full" />
							<div>
								<TableHead />
								<TableBody transactions={transactions} />
							</div>
						</div>
					</div>
				</>
			)}
		</>
	)
}

export default Client
