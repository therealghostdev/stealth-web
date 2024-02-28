"use client"
import {
	EnvelopeSimple,
	FacebookLogo,
	PhoneCall,
	TwitterLogo,
} from "@phosphor-icons/react"
import React from "react"

export const Links = [
	{
		name: "facebook",
		icon: <FacebookLogo />,
		url: "https://facebook.com/stealthmoney",
	},
	{
		name: "twitter",
		icon: <TwitterLogo />,
		url: "https://twitter.com/stealthmoney_",
	},
	{
		name: "email",
		icon: <EnvelopeSimple />,
		url: "mailto:info@stealth.money",
	},
	{
		name: "phone",
		icon: <PhoneCall />,
		url: "tel:+2347087776222",
	},
]
