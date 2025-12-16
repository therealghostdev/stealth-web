import { auth } from "@/auth"
import { RedirectClient } from "@/components/shared/redirectClient"

export default async function Home() {
	const data = await auth()
	// redirect to /dashboard if user is signed in
	console.log(data, "is data1")
	if (
		data?.accessToken &&
		data?.expires &&
		new Date(data.expires) > new Date()
	) {
		console.log("ran")
		return <RedirectClient to="/dashboard" />
	}
	// redirect to /account/login if user is not signed in
	console.log("ran1")
	return <RedirectClient to="/account/login" />
}
