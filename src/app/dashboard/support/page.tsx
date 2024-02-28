"use client"

import React from "react"

import { Links } from "./links"

const Page = () => {
	return (
		<div className="w-full">
			<div className="mb-6 flex w-full items-center">
				<p className="font-satoshi text-2xl font-bold capitalize">Help & Support</p>
			</div>
			<div className="h-[80vh] w-full rounded-md border border-white-700 bg-black-700 p-6 text-white-300">
				<p className="text-4xl">Get in touch us for more information</p>
				<div className="my-6 flex flex-col gap-5">
					{Links.map((link) => (
						<div className="flex items-center gap-5" key={link.name}>
							<div className="text-3xl">{link.icon}</div>
							<a
								key={link.name}
								href={link.url}
								target="_blank"
								className="link white">
								{link.url}
							</a>
						</div>
					))}
				</div>
			</div>
		</div>
	)
}

export default Page
