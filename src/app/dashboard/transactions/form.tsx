"use client"
import { Funnel, MagnifyingGlass } from "@phosphor-icons/react"
import React from "react"
import { Button, Input } from "@/components"

export default function Form({
	query,
	setQuery,
}: {
	query: string
	setQuery: React.Dispatch<React.SetStateAction<string>>
}) {
	const handleSubmit = (e: React.ChangeEvent<HTMLFormElement>) => {
		e.preventDefault()
		if (!query) {
			alert("Please enter a valid search term!")
		}
	}

	return (
		<form
			onSubmit={handleSubmit}
			className="flex flex-col items-center gap-5 md:flex-row">
			<Input
				typed="text"
				value={query}
				onChange={(e) => setQuery(e.target.value)}
				placeholder="Search by month, date, amount..."
				width="w-[300px]"
				icon={<MagnifyingGlass size={22} />}
			/>
		</form>
	)
}
