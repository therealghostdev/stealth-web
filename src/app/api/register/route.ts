import endpoints from "@/config/endpoints"
import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest, response: NextResponse) {
    const url = endpoints().user.register
    const userData = request.body
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
                "Content-Type": "application/json"
            },
            method: "POST"
        })

        if (res.status === 201 || res.ok) {
            console.log("User created")
            return NextResponse.json(
                { success: true, message: "User created" },
                { status: 201 }
            )
        } else if (res.status === 400) {
            console.log("Bad input", res.json())
            return NextResponse.json(
                { success: false, message: "Bad input" },
                { status: 400 }
            )
        } else {
            console.log("Bad input", res.json())
            return NextResponse.json(
                { success: false, message: "User not created" },
                { status: 500 }
            )
        }
    } catch (error) {
        console.log("User not created", error)
        return NextResponse.json(
            { success: false, message: "User not created" },
            { status: 500 }
        )
    }
}
