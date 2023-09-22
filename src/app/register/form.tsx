"use client"

import React from "react"

import { redirect } from "next/navigation"

type FormProps = {
    action: (
        formData: FormData
    ) => Promise<{ error?: string; success?: boolean }>
}

const Form = ({ action, ...props }: FormProps) => {
    const [password, setPassword] = React.useState("")
    const [confirmPassword, setConfirmPassword] = React.useState("")
    const [passwordsMatch, setPasswordsMatch] = React.useState(false)
    const [email, setEmail] = React.useState("")
    const [loading, setLoading] = React.useState(false)
    const [error, setError] = React.useState("")

    const validateData = () => {
        if (error) {
            setError("")
        }
        if (password !== confirmPassword) {
            setError("Passwords do not match")
            return false
        }
        if (password.length < 8) {
            setError("Password must be at least 8 characters")
            return false
        }

        return true
    }

    const isButtonDisabled =
        loading ||
        error !== "" ||
        !password ||
        !confirmPassword ||
        !email ||
        !passwordsMatch

    const formAction = async (formData: FormData) => {
        const isValid = validateData()
        if (isValid === false) {
            return
        }
        setLoading(true)
        const res = await action(formData)
        setLoading(false)
        if (res.error) {
            setError(res.error)
            return
        }
        setError("")
        setEmail("")
        setPassword("")
        setConfirmPassword("")
        // redirect("/account/activate")
    }

    React.useEffect(() => {
        if (error === "") {
            return
        }
        setTimeout(() => {
            setError("")
        }, 3000)
    }, [error])

    React.useEffect(() => {
        setPasswordsMatch(password === confirmPassword)
    }, [password, confirmPassword])

    return (
        <form
            action={formAction}
            {...props}
            className="flex flex-col absolute top-[45%] left-[50%] -translate-x-[50%] -translate-y-[45%]"
        >
            <div
                className={`bg-none ${
                    error ? "bg-red-100" : ""
                } rounded-lg px-5 py-4 mb-5 flex items-center justify-center text-[14px] text-red-700 font-semibold opacity-[0.8]`}
            >
                {error ? <p>{error}</p> : null}
            </div>

            <div className="bg-slate-50 w-[300px] h-fit rounded-xl pt-3 pb-8">
                <h2 className="text-[20px] font-semibold text-black text-center pt-3">
                    Create Account
                </h2>
                <div className="flex flex-col px-5 py-2">
                    <label
                        htmlFor="email"
                        className="text-[14px] font-semibold text-black mb-1"
                    >
                        Email
                    </label>
                    <input
                        className="border border-gray-300 rounded-lg px-3 py-2 text-[14px] text-black"
                        type="email"
                        name="email"
                        required
                        value={email}
                        placeholder="theo@stealth.money"
                        onChange={(event) => setEmail(event.target.value)}
                    />
                </div>
                <div className="flex flex-col px-5 py-2">
                    <label
                        htmlFor="password"
                        className="text-[14px] font-semibold text-black mb-1"
                    >
                        Password
                    </label>
                    <input
                        className="border border-gray-300 rounded-lg px-3 py-2 text-[14px] text-black"
                        required
                        name="password"
                        type="password"
                        value={password}
                        placeholder="Password"
                        onChange={(event) => setPassword(event.target.value)}
                    />
                </div>
                <div className="flex flex-col px-5 py-4">
                    <label
                        htmlFor="confirm-password"
                        className="text-[14px] font-semibold text-black mb-1"
                    >
                        Confirm Password
                    </label>
                    <input
                        className="border border-gray-300 rounded-lg px-3 py-2 text-[14px] text-black"
                        required
                        type="password"
                        value={confirmPassword}
                        placeholder="Password"
                        onChange={(event) =>
                            setConfirmPassword(event.target.value)
                        }
                    />
                </div>
                <div className="flex flex-col px-5 py-2">
                    <button
                        disabled={isButtonDisabled}
                        className="bg-black disabled:cursor-not-allowed disabled:bg-slate-400 text-white rounded-lg px-3 py-2 text-[14px] font-semibold"
                    >
                        Register
                    </button>
                </div>
            </div>
        </form>
    )
}

export default Form
