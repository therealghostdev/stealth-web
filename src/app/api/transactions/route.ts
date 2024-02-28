import { NextRequest, NextResponse } from "next/server"
import endpoints from "@/config/endpoints"

export async function GET(request: NextRequest, response: NextResponse) {
	try {
		const url = endpoints().transactions.list
		const res = await fetch(url, {
			method: "GET",
			headers: { "Content-Type": "application/json" },
		})
		if (res.ok) {
			return NextResponse.json(
				{
					success: true,
					message: "Transactions retrieved!",
					data: res,
				},
				{ status: 201 }
			)
		} else if (res.status === 400) {
			return NextResponse.json(
				{ success: false, message: "Bad request!" },
				{ status: 400 }
			)
		} else if (res.status === 401) {
			return NextResponse.json(
				{
					success: false,
					message: "You're not authorized to make this request!",
				},
				{ status: 400 }
			)
		} else {
			return NextResponse.json(
				{ success: false, message: "Internal server error" },
				{ status: 500 }
			)
		}
	} catch (error) {
		return NextResponse.json(
			{ success: false, message: "Internal server error" },
			{ status: 500 }
		)
	}
}
