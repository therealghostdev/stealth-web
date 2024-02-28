import CredentialsProvider from "next-auth/providers/credentials"
import { NextAuthOptions, Session } from "next-auth"
import { JWT } from "next-auth/jwt"
import jwt_decode from "jwt-decode"

import endpoints from "@/config/endpoints"
import { DecodedJwt } from "@/types/jwt"

export const authOptions: NextAuthOptions = {
	providers: [
		CredentialsProvider({
			name: "Credentials",
			credentials: {
				username: {
					label: "username/email",
					type: "text",
					placeholder: "extheo@stealth.money",
				},
				password: {
					label: "Password",
					type: "password",
					placeholder: "********",
				},
			},
			async authorize(credentials, req) {
				const authEndpoint = endpoints().auth.login
				const res = await fetch(authEndpoint, {
					method: "POST",
					body: JSON.stringify({
						username: credentials?.username,
						password: credentials?.password,
					}),
					headers: { "Content-Type": "application/json" },
				})

				const user = await res.json()
				if (res.ok && user) {
					return user
				} else {
					return null
				}
			},
		}),
	],
	pages: {
		signIn: "/account/login",
		signOut: "/account/logout",
	},
	session: {
		// maxAge: 60 * 15 // 15 minutes
		strategy: "jwt",
	},
	callbacks: {
		async signIn({ user }) {
			if (user && user?.id_token) {
				return true
			} else {
				return false
			}
		},
		async jwt({ token, user }) {
			if (user && user?.id_token) {
				token.id_token = user.id_token
			}
			return token
		},
		async session({ session, token }: { session: Session; token: JWT }) {
			session.accessToken = undefined
			if (token.id_token) {
				const decoded: DecodedJwt = jwt_decode(token.id_token)
				session.accessToken = token.id_token
				session.expires = new Date(decoded.exp * 1000).toISOString()
				if (decoded.sub.includes("@")) {
					token.email = decoded.sub
					session.user.email = decoded.sub
				} else {
					token.name = decoded.sub
					session.user.name = decoded.sub
				}
				session.user.role = decoded.auth
			}
			return session
		},
	},
	events: {
		signOut: async (message) => {
			const { token } = message
			token.id_token = undefined
		},
	},
}
