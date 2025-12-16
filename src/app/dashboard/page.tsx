import { RedirectClient } from "@/components/shared/redirectClient"
import { getAllPaymentDetails, getExchangeRate } from "../helpers/get-price"
import { getProfile } from "../helpers/get-profile"
import Client from "./client"
import { ExpiredSessionError } from "@/shared/error"
import { auth } from "@/auth"
import { verifyAuthTokenExpiry } from "@/shared/functions"

const Page = async () => {
	const data = await auth()
	let shouldRedirect = await verifyAuthTokenExpiry(data)

	if (shouldRedirect) {
		return <RedirectClient to="/account/login" />
	}

	const transactionsRes = await getAllPaymentDetails()
	const rate = await getExchangeRate()
	const profile = await getProfile()

	if (rate instanceof Error) {
		return (
			<div className="flex h-screen flex-col items-center justify-center">
				<h1 className="mt-4 font-satoshi text-lg font-bold">
					Failed to fetch exchange rate!
				</h1>
				<p className="mt-2 text-sm text-gray-500">{rate.message}</p>
			</div>
		)
	}

	if (profile instanceof Error) {
		if (profile instanceof ExpiredSessionError) {
			return <RedirectClient to="/account/login" />
		}
		return (
			<div className="flex h-screen flex-col items-center justify-center">
				<h1 className="mt-4 font-satoshi text-lg font-bold">
					Failed to fetch user profile!
				</h1>
				<p className="mt-2 text-sm text-gray-500">{profile.message}</p>
			</div>
		)
	}

	return (
		<Client
			exchangeRate={rate}
			profile={profile}
			transactions={transactionsRes.data ?? []}
		/>
	)
}

export default Page
