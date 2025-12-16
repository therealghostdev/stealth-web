import { useState } from "react"

import { ExchangeRateProps, PaymentDetailsProps } from "@/types/price"
import Processing from "./processing"
import Success from "./success"
import Payment from "./payment"
import Init from "./init"
import { UserProps } from "@/types/profile"

type BuyState = "init" | "payment" | "processing" | "success"

interface Props {
	paymentConfig: UserProps["physicalWallets"] | []
	amount: string
	currency: string
	exchangeRate: ExchangeRateProps["data"]
	dismiss: () => void
}

export type PaymentDetails = Pick<
	PaymentDetailsProps["data"],
	| "accountNumber"
	| "accountName"
	| "bankName"
	| "paymentReference"
	| "feeAmount"
	| "amountDue"
	| "amountInSats"
	| "amount"
	| "narration"
>

const InstantBuy = (props: Props) => {
	const [screen, setScreen] = useState<BuyState>("init")
	const [txnHash, setTxnHash] = useState("")
	const [paymentState, setPaymentState] = useState("PENDING")

	const [depositInfo, setDepositInfo] = useState<PaymentDetails>({
		accountNumber: "",
		accountName: "",
		bankName: "",
		paymentReference: "",
		feeAmount: "",
		amountDue: "",
		amountInSats: "",
		amount: "",
		narration: "",
	})
	const [fields, setFields] = useState({
		amount: props.amount.replace(/,/g, ""),
		currency: props.currency,
		amountInSats: "",
		narration: "",
		walletAddress: "",
		walletId: "",
		usexpub: false,
	})

	const pasteWalletAddress = async () => {
		navigator.clipboard.readText().then((text) => {
			if (text) {
				setFields({ ...fields, walletAddress: text })
			}
		})
	}

	const handleChange = (
		e:
			| React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
			| { target: { name: string; value: boolean | string } }
	) => {
		const { name, value } = e.target
		if (name === "amount" && typeof value === "string") {
			const cleanValue = value.replace(/,/g, "")
			setFields({ ...fields, [name]: cleanValue })
		} else {
			setFields({ ...fields, [name]: value })
		}
	}

	return (
		<div className="min-h-[70dvh] w-full">
			{screen === "init" && (
				<Init
					paymentConfig={props.paymentConfig}
					fields={fields}
					handleChange={handleChange}
					exchangeRate={props.exchangeRate}
					pasteWalletAddress={pasteWalletAddress}
					setDepositInfo={setDepositInfo}
					setAmountInSats={(value: string) =>
						setFields({ ...fields, amountInSats: value })
					}
					next={() => setScreen("payment")}
					close={() => props.dismiss()}
				/>
			)}
			{screen === "payment" && (
				<Payment
					amount={fields.amount}
					depositInfo={depositInfo}
					next={() => setScreen("processing")}
					previous={() => setScreen("init")}
					close={() => props.dismiss()}
					paymentState={paymentState}
					setPaymentState={setPaymentState}
				/>
			)}
			{screen === "processing" && (
				<Processing
					amountPayable={depositInfo.amountDue}
					paymentReference={depositInfo.paymentReference}
					setTxnHash={(value) => setTxnHash(value)}
					paymentState={paymentState}
					setPaymentState={setPaymentState}
					next={() => setScreen("success")}
				/>
			)}
			{screen === "success" && (
				<Success txnHash={txnHash} next={() => props.dismiss()} />
			)}
		</div>
	)
}

export default InstantBuy
