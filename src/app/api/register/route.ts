import endpoints from "@/config/endpoints"
import { NextRequest, NextResponse } from "next/server"

export async function POST(request: Request, response: NextResponse) {
	const url = endpoints().user.register
	const userData = await request.json()
	if (!userData) {
		return NextResponse.json(
			{ success: false, message: "Bad input" },
			{ status: 400 }
		)
	}
	try {
		const res = await fetch(url, {
			body: JSON.stringify(userData),
			headers: {
				"Content-Type": "application/json",
			},
			method: "POST",
		})

		if (res.status === 201) {
			return NextResponse.json(
				{ success: true, message: "User created" },
				{ status: 201 }
			)
		} else if (res.status === 400) {
			return NextResponse.json(
				{ success: false, message: "Bad input" },
				{ status: 400 }
			)
		} else {
			throw new Error("Failed to create user")
		}
	} catch (error) {
		return NextResponse.json(
			{ success: false, message: "User not created" },
			{ status: 500 }
		)
	}
}
