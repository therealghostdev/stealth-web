interface bvnQuery {
	bvn: string
}
interface faceQuery extends bvnQuery {
	image: File | null
}

export const verifyface = async ({ image, bvn }: faceQuery) => {
	if (!(image instanceof File)) throw new Error("Invalid image")

	const base64Image = await fileToBase64(image)

	const response = await fetch("/api/verify_kyc", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ bvn, image: base64Image }),
	})

	if (!response.ok) {
		const err = await response.json()
		throw new Error(err?.error || "Something went wrong")
	}

	return await response.json()
}

const fileToBase64 = (file: File): Promise<string> => {
	return new Promise((resolve, reject) => {
		const reader = new FileReader()
		reader.readAsDataURL(file)
		reader.onload = () => {
			const base64String = reader.result as string
			const base64Content = base64String.split(",")[1]
			resolve(base64Content)
		}
		reader.onerror = (error) => reject(error)
	})
}
