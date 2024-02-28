"use client"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import Link from "next/link"

import { Button, Dialog, Input, Spinner } from "@/components"

const Page = () => {
	const searchParams = useSearchParams()
	const key = searchParams.get("key")
	const router = useRouter()

	const [passwordsMatch, setPasswordsMatch] = useState(false)
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState("")
	const [formFields, setFormFields] = useState({
		password: "",
		confirm_password: "",
	})

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
		setFormFields({ ...formFields, [e.target.name]: e.target.value })

	const handleSubmit = async () => {
		try {
			setLoading(true)
			const res = await fetch(`/api/finish-reset`, {
				method: "POST",
				body: JSON.stringify({ password: formFields.password, key }),
				headers: { "Content-Type": "application/json" },
			})
			if (res && !res.ok) {
				setError(await res.text())
			}
			setLoading(false)
		} catch (error) {
			if (error instanceof Error) {
				setError(error.message)
			}
			setLoading(false)
		}
	}

	useEffect(() => {
		setPasswordsMatch(formFields.password === formFields.confirm_password)
	}, [formFields.confirm_password, formFields.password])

	return (
		<>
			{error && (
				<Dialog
					isOpen={error !== ""}
					onDismiss={() => setError("")}
					title={error}
					type="error"
					large
					description="">
					<div></div>
				</Dialog>
			)}
			<div className="h-full w-full">
				<p className="font-satoshi text-[28px] font-bold">Reset your Password?</p>
				<p className="font-satoshi text-lg">Please enter your new password.</p>
				<form onSubmit={handleSubmit} className="mt-10 flex w-full flex-col">
					<div className="flex w-full flex-col gap-6">
						<Input
							typed="password"
							name="password"
							onChange={handleChange}
							label="New Password"
						/>
						<Input
							typed="password"
							name="confirm_password"
							onChange={handleChange}
							label="Confirm Password"
							error={passwordsMatch ? "" : "Passwords do not match"}
						/>
					</div>
					<div className="mt-[400px] flex w-full flex-col gap-5">
						<div className="grid w-full grid-cols-2 gap-6">
							<Button
								type="button"
								onClick={() => router.back()}
								width="w-full bg-black-600">
								Back to Log In
							</Button>
							<Button type="submit" width="w-full" disabled={loading}>
								{loading ? <Spinner /> : "Reset Password"}
							</Button>
						</div>
						<p className="flex items-center justify-center text-center">
							Don&apos;t have an account yet?
							<Link href="/account/register" className="link ml-1 text-alt-orange-100">
								Create account
							</Link>
						</p>
					</div>
				</form>
			</div>
		</>
	)
}

export default Page
