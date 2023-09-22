import endpoints from "@/config/endpoints"
import Activate from "./code"

const activate = async (code: string) => {
    "use server"
    const url = endpoints(code).user.activate
    const res = await fetch(url, {
        headers: {
            "Content-Type": "application/json"
        }
    })
    if (!res.ok || res.status !== 200) {
        const data = await res.json()
        return { error: data.message }
    }

    return { success: true }
}

export default async function Page() {
    return <Activate action={activate} />
}
