import endpoints from "@/config/endpoints"

import Form from "./form"

const registerUser = async (formData: FormData) => {
    "use server"
    const url = endpoints().user.register
    const email = formData.get("email")
    const password = formData.get("password")
    const res = await fetch(url, {
        body: JSON.stringify({
            email,
            password
        }),
        headers: {
            "Content-Type": "application/json"
        },
        method: "POST"
    })

    if (!res.ok) {
        const data = await res.json()
        return { error: data.message }
    }

    return { success: true }
}

export default async function Page() {
    return <Form action={registerUser} />
}
