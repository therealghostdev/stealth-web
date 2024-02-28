import { redirect } from "next/navigation"

import { ExpiredSessionError, InvalidAuthenticatorError } from "@/shared/error"

import { getProfile } from "../helpers/get-profile"
import DashboardLayoutClient from "./layout-client"

export default async function DashboardLayout({
	children,
}: {
	children: React.ReactNode
}) {
	const user = await getProfile()

	if (
		user instanceof ExpiredSessionError ||
		user instanceof InvalidAuthenticatorError
	) {
		redirect("/account/login")
	}

	if (user instanceof Error) {
		return <div>{user.message}</div>
	}

	return <DashboardLayoutClient user={user}>{children}</DashboardLayoutClient>
}
