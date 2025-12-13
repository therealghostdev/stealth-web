import { withAuth } from "next-auth/middleware"

export default withAuth({
	pages: {
		signIn: "/account/login",
	},
})

export const config = {
	matcher: ["/", "/dashboard/:path*"],
}
