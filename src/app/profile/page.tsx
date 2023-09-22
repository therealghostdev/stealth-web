import { Profile } from "@/types/profile"
import { getProfile } from "./get-profile"
import { redirect } from "next/navigation"

export default async function Page() {
    const profileData: Profile = await getProfile()
    if (!profileData) {
        return (
            <main className="flex min-h-screen flex-col items-center justify-between p-24">
                <div>
                    <h1 className="text-4xl font-bold text-center">
                        You are not signed in
                    </h1>
                    <p className="text-center">
                        You can only see this if you are signed in.
                    </p>
                    <div className="mt-8 flex items-center justify-center flex-col">
                        <button
                            className="mt-8 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                            onClick={() =>
                                redirect(
                                    "/api/auth/signin?callbackUrl=/profile"
                                )
                            }
                        >
                            Sign in
                        </button>
                    </div>
                </div>
            </main>
        )
    }
    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
            <div>
                <h1 className="text-4xl font-bold text-center">Your data</h1>
                <table className="table-auto">
                    <thead>
                        <tr>
                            <th className="px-4 py-2">FirstName</th>
                            <th className="px-4 py-2">LastName</th>
                            <th className="px-4 py-2">Email</th>
                            <th className="px-4 py-2">Profile Type</th>
                            <th className="px-4 py-2">Username</th>
                            <th className="px-4 py-2">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="border px-4 py-2">
                                {profileData.firstName}
                            </td>
                            <td className="border px-4 py-2">
                                {profileData.lastName}
                            </td>
                            <td className="border px-4 py-2">
                                {profileData.email}
                            </td>
                            <td className="border px-4 py-2">
                                {profileData.profileType}
                            </td>
                            <td className="border px-4 py-2">
                                {profileData.login}
                            </td>
                            <td className="border px-4 py-2">
                                {profileData.status}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </main>
    )
}
