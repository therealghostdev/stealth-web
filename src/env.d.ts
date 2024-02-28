const requiredEnvVars = [
	"NEXT_PUBLIC_STEALTH_ENDPOINT_DEV",
	"NEXT_PUBLIC_STEALTH_ENDPOINT_PROD",
	"STEALTH_ENDPOINT_DEV",
	"STEALTH_ENDPOINT_PROD",
	"NEXTAUTH_SECRET",
	"NEXTAUTH_URL",
	"NODE_ENV",
] as const

type RequiredEnvVars = (typeof requiredEnvVars)[number]

declare global {
	namespace NodeJS {
		interface ProcessEnv extends Record<RequiredEnvVars, string> {
			readonly NEXT_PUBLIC_STEALTH_ENDPOINT_DEV: string
			readonly NEXT_PUBLIC_STEALTH_ENDPOINT_PROD: string
			readonly STEALTH_ENDPOINT_DEV: string
			readonly STEALTH_ENDPOINT_PROD: string
			readonly NEXTAUTH_SECRET: string
			readonly NEXTAUTH_URL: string
			readonly NODE_ENV: "development" | "production"
		}
	}
}

export {}
