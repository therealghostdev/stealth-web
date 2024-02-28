import { NextResponse } from "next/server"
import endpoints from "@/config/endpoints"

export async function POST(request: Request, response: NextResponse) {
	const url = endpoints().auth["finish-reset-password"]
	const payload = await request.json()
	try {
		const res = await fetch(url, {
			method: "POST",
			body: JSON.stringify(payload),
			headers: {
				"Content-Type": "application/json",
			},
		})
		if (res.status === 201 || res.ok) {
			return NextResponse.json(
				{
					success: true,
					message: "your password has been reset!!",
				},
				{ status: 201 }
			)
		} else if (res.status === 400) {
			return NextResponse.json(
				{ success: false, message: "Bad request" },
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
