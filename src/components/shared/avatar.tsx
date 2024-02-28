import Image from "next/image"
import React from "react"

interface Props {
	imageUrl: string | null
	name: string
	email: string
}

const getChars = (value: string) =>
	value
		.split(" ")
		.map((char) => char.charAt(0))
		.join("")

const Avatar = (props: Props) => {
	return (
		<div className="h-full w-full rounded-full">
			{props.imageUrl ? (
				<Image
					src={props.imageUrl}
					alt={props.name}
					className="h-full w-full rounded-full object-contain"
				/>
			) : (
				<div className="grid h-full w-full place-items-center rounded-full">
					<p className="text-5xl font-bold uppercase">
						{!props.name ? props.email.substring(0, 1) : getChars(props.name)}
					</p>
				</div>
			)}
		</div>
	)
}

export default Avatar
