"use client"
import React, { useState } from "react"
import Image from "next/image"

interface Props {
	setFile: (file: File) => void
}

const ImageUpload = (props: Props) => {
	const [previewUrl, setPreviewUrl] = useState<ArrayBuffer | string | null>(null)

	const handleFile = (file: File) => {
		const fileReader = new FileReader()
		fileReader.onload = () => setPreviewUrl(fileReader.result)
		fileReader.readAsDataURL(file)
		props.setFile(file)
	}

	const handleSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (!e.target.files) return
		const file = e.target.files[0]
		const { type, size } = file
		if (size > 5000) return new Error("File too large!")
		if (
			type !== "image/png" &&
			type !== "image/jpeg" &&
			type !== "image/jpg" &&
			type !== "image/webp"
		)
			return new Error("Invalid file type!")
		handleFile(file)
	}

	return (
		<div className="aspect-square w-[150px]">
			{previewUrl ? (
				<div className="relative h-full w-full overflow-hidden">
					<Image
						src={`${previewUrl}`}
						alt="image-preview"
						className="object-cover"
						fill
						sizes="(max-width: 1024px) 100%,"
						priority
					/>
				</div>
			) : (
				<div className="h-full w-full overflow-hidden">
					<label htmlFor="image-upload">
						<input
							type="file"
							id="image-upload"
							accept="image/*"
							onChange={handleSelectFile}
							multiple={false}
						/>
					</label>
				</div>
			)}
		</div>
	)
}

export default ImageUpload
