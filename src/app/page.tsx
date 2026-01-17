import { auth } from "@/auth"
import { RedirectClient } from "@/components/shared/redirectClient"

export default async function Home() {
	const data = await auth()
	// redirect to /dashboard if user is signed in
	if (
		data?.accessToken &&
		data?.expires &&
		new Date(data.expires) > new Date()
	) {
		return <RedirectClient to="/dashboard" />
	}
	// redirect to /account/login if user is not signed in
	return <RedirectClient to="/account/login" />
}
