import React from "react"

import ComingSoon from "@/components/coming-soon"

const Page = () => {
	return (
		<div className="w-full">
			<div className="mb-6 flex w-full items-center">
				<p className="font-satoshi text-2xl font-bold capitalize">Resources</p>
			</div>
			<ComingSoon />
		</div>
	)
}

export default Page
