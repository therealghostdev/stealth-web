"use client"

import { useSearchParams } from "next/navigation"

export default function Activate() {
    const searchParams = useSearchParams()
    const code = searchParams.get("key")
    return (
        <div className="h-[100vh]">
            <h1>Activate</h1>
            <p>Code: {code}</p>
        </div>
    )
}
