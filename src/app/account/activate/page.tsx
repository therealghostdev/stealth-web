"use client"
import { useSearchParams } from "next/navigation"
import { useQuery } from "@tanstack/react-query"
import Link from "next/link"

import { activate } from "@/app/helpers/activate"
import { Dialog, Spinner } from "@/components"
import React from "react"

interface Data {
	status: number
	message: string
}

const Page = () => {
	const searchParams = useSearchParams()
	const key = searchParams.get("key")

	const [loading, setLoading] = React.useState(true)
	const [data, setData] = React.useState<Data>()

	const activateAccount = React.useCallback(async () => {
		setLoading(true)
		const res = await activate(String(key))
		setLoading(false)
		setData(res)
	}, [key])

	React.useEffect(() => {
		activateAccount()
		// TODO! remove eslint-disable-next-line and refactor the code to be a server side rendered page
		// and a loading suspense fallback for the spinner
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	if (data && data.status !== 200) {
		return (
			<Dialog
				isOpen={data.status !== 200}
				onDismiss={() => {}}
				title="Account Activation Error!"
				type="error"
				large
				description="Sorry we could not activate your account. Please try again later">
				<div></div>
			</Dialog>
		)
	}
	if (data && data.status === 200) {
		return (
			<Dialog
				isOpen={data.status === 200}
				onDismiss={() => {}}
				title="You've created your Stealth account"
				type="success"
				large
				description="Your account has been activated!">
				<div>
					<Link
						href="/account/login"
						className="text-white flex h-12 w-fit items-center justify-center gap-1 rounded bg-alt-orange-500 px-4 font-satoshi text-sm font-medium transition-all duration-200 active:scale-[0.98]">
						Continue to login
					</Link>
				</div>
			</Dialog>
		)
	}

	if (loading)
		return (
			<div className="grid h-full w-full place-items-center">
				<Spinner />
			</div>
		)
}

export default Page
