import { auth } from "@/auth"
import { redirect } from "next/navigation"

export default async function Home() {
	const data = await auth()
	// redirect to /dashboard if user is signed in
	if (data?.accessToken) {
		redirect("/dashboard")
	}

	// redirect to /account/login if user is not signed in
	redirect("/account/login")
}
