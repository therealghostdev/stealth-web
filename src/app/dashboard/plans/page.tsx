import Create from "@/components/plan/create-plan/create"
import { getExchangeRate } from "@/app/helpers/get-price"
import { getProfile } from "@/app/helpers/get-profile"

const Page = async () => {
	const rate = await getExchangeRate()
	const profile = await getProfile()
	return <Create exchangeRate={rate} profile={profile} />
}

export default Page
