export { default } from "next-auth/middleware"

export const config = {
	matcher: [
		"/",
		{
			source: "/dashboard/:path*",
			missing: [
				{ type: "header", key: "next-router-prefetch" },
				{ type: "header", key: "purpose", value: "prefetch" },
			],
		},
	],
}
