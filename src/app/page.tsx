import { auth } from "@/auth"

export default async function Home() {
    const data = await auth()

    if (!data?.accessToken) {
        return (
            <main className="flex min-h-screen flex-col items-center justify-between p-24">
                <div>
                    <h1 className="text-4xl font-bold text-center">
                        You are not signed in
                    </h1>
                    <p className="text-center">
                        You can only see this if you are signed in.
                    </p>
                </div>
            </main>
        )
    }
    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
            <div>
                <h1 className="text-4xl font-bold text-center">Your data</h1>
                <p className="text-center">
                    This is your data. You can only see this if you are signed
                    in.
                </p>
                <div className="mt-8 flex items-center justify-center flex-col">
                    <h2 className="text-2xl font-bold">Session</h2>
                    <p className="text-center">Name: {data?.user.name || data.user.email}</p>
                    <p className="text-center">E-mail: {data?.user.role}</p>
                </div>
            </div>
        </main>
    )
}
