import jwt_decode from "jwt-decode"
import { NextAuthOptions, Session } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

import endpoints from "@/config/endpoints"
import { DecodedJwt } from "@/types/jwt"

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                username: {
                    label: "Username/email",
                    type: "text",
                    placeholder: "extheo@stealth.money"
                },
                password: {
                    label: "Password",
                    type: "password",
                    placeholder: "********"
                }
            },
            async authorize(credentials, req) {
                const authEndpoint = endpoints().auth.login
                const res = await fetch(authEndpoint, {
                    method: "POST",
                    body: JSON.stringify(credentials),
                    headers: { "Content-Type": "application/json" }
                })

                const user = await res.json()
                if (res.ok && user) {
                    return user
                } else {
                    return null
                }
            }
        })
    ],
    session: {
        maxAge: 60 * 15 // 15 minutes
    },
    callbacks: {
        async jwt({ token, user }: { token: any; user: any }) {
            if (user && user?.id_token) {
                token.accessToken = user.id_token
            }
            return token
        },

        async session({ session, token }: { session: Session; token: any }) {
            if (token.accessToken) {
                const decoded: DecodedJwt = jwt_decode(token.accessToken)
                session.accessToken = token.accessToken
                session.user.name = decoded.sub
                session.user.role = decoded.auth
            }
            console.log({ session })
            return session
        }
    }
}
