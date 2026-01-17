import endpoints from "@/config/endpoints"
import { NextRequest, NextResponse } from "next/server"

export async function POST(request: Request) {
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

		const data = await res.json()

		if (!res.ok) {
			return NextResponse.json(
				{
					success: false,
					message: data?.message || "Request failed",
					error: data?.error,
				},
				{ status: res.status }
			)
		}

		return NextResponse.json(
			{
				success: true,
				message: "User created",
			},
			{ status: 201 }
		)
	} catch (error) {
		return NextResponse.json(
			{ success: false, message: "User not created" },
			{ status: 500 }
		)
	}
}
