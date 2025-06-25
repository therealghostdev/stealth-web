import { NextResponse } from "next/server"
import { auth } from "@/auth"
import endpoints from "@/config/endpoints"

export async function POST(req: Request) {
	try {
		const session = await auth()
		if (!session) {
			return NextResponse.json({ error: "No session" }, { status: 401 })
		}

		const { accessToken } = session
		if (!accessToken) {
			return NextResponse.json({ error: "No token" }, { status: 401 })
		}

		const { image, bvn } = await req.json()

		if (!image || !bvn) {
			return NextResponse.json({ error: "Missing image or bvn" }, { status: 400 })
		}

		const url = endpoints().kyc

		const response = await fetch(url, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${accessToken}`,
			},
			body: JSON.stringify({ bvn, image }),
		})

		const result = await response.json()

		return NextResponse.json(result)
	} catch (error) {
		console.error("Kyc Verification Error:", error)
		return NextResponse.json({ error: "Internal server error" }, { status: 500 })
	}
}
