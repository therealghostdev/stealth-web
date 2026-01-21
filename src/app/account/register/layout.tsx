import RecaptchaProvider from "@/app/context/RegisterRecaptcha"
import React from "react"

export default function Layout({ children }: { children: React.ReactNode }) {
	return <RecaptchaProvider>{children}</RecaptchaProvider>
}
