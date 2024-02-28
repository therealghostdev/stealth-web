import { NextRequest, NextResponse } from "next/server"
import endpoints from "@/config/endpoints"

export async function GET(request: NextRequest, response: NextResponse) {
	const url = endpoints().user.activate
	const key = await request.nextUrl.searchParams.get("key")
	if (!key) {
		return NextResponse.json(
			{ success: false, message: "Invalid activation key!" },
			{ status: 400 }
		)
	}
	try {
		const res = await fetch(url, {
			method: "GET",
			body: JSON.stringify({ key }),
			headers: { "Content-Type": "application/json" },
		})
		if (res.status === 201 || res.ok) {
			return NextResponse.json(
				{ success: true, message: "Your account has been activated!" },
				{ status: 201 }
			)
		} else if (res.status === 400) {
			return NextResponse.json(
				{ success: false, message: "Bad request!" },
				{ status: 400 }
			)
		} else {
			return NextResponse.json(
				{ success: false, message: "Internal server error!" },
				{ status: 500 }
			)
		}
	} catch (error) {
		return NextResponse.json(
			{ success: false, message: "Internal server error!" },
			{ status: 500 }
		)
	}
}
