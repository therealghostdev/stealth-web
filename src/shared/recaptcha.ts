"use client"
import { useGoogleReCaptcha } from "react-google-recaptcha-v3"

export function useRecaptcha() {
	const { executeRecaptcha } = useGoogleReCaptcha()
    console.log(executeRecaptcha, "exec");
    

	const getToken = async (action: string) => {
		if (!executeRecaptcha) {
			throw new Error("reCAPTCHA not ready")
		}
		return executeRecaptcha(action)
	}

	return { getToken }
}
