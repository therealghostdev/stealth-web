"use client"
import { useEffect, useState } from "react"

import { Authentication, Profile, Security } from "@/components/profile"
import { Spinner, TabPanel } from "@/components"
import { UserProps } from "@/types/profile"
import { getProfile } from "@/app/helpers/get-profile"

const TabList = ["Profile", "Security Settings", "2-FA"]

const Page = () => {
	const [user, setUser] = useState<UserProps | null>(null)
	const [tab, setTab] = useState(0)

	useEffect(() => {
		const getUser = async () => {
			const data = await getProfile()
			if (data instanceof Error) {
				return console.error(data)
			}
			setUser(data)
		}
		getUser()
	}, [])

	if (!user) return <Spinner />

	return (
		<div className="flex h-full w-full flex-col gap-6">
			<p className="font-satoshi text-2xl font-bold">My Profile</p>
			<div className="mt-5 w-full">
				<div className="mb-6 flex items-center">
					{TabList.map((item, index) => (
						<button
							key={index}
							onClick={() => setTab(index)}
							// TODO!: remove 2-FA condition when 2-FA is implemented
							className={`${item === "2-FA" ? "" : "border-b p-4"} ${
								tab === index
									? "border-alt-orange-100 text-alt-orange-100"
									: "text-white-100"
							}`}>
							{item === "2-FA" ? "" : item}
						</button>
					))}
				</div>
				<TabPanel tabIndex={0} index={tab}>
					<Profile {...user} />
				</TabPanel>
				<TabPanel tabIndex={1} index={tab}>
					<Security {...user} />
				</TabPanel>
				<TabPanel tabIndex={2} index={tab}>
					<Authentication {...user} />
				</TabPanel>
			</div>
		</div>
	)
}

export default Page
