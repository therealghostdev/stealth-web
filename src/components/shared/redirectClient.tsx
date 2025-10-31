"use client"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import Spinner from "./spinner"

export const RedirectClient = ({ to }: { to: string }) => {
	const router = useRouter()

	useEffect(() => {
		router.push(to)
	}, [router, to])

	return (
		<div className="flex h-screen items-center justify-center">
			<Spinner />
		</div>
	)
}
