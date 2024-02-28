"use client"
import {
	CalendarBlank,
	Headset,
	ListDashes,
	SquaresFour,
	Stack,
	User,
} from "@phosphor-icons/react"

export const NavList = [
	{
		icon: <SquaresFour size={24} />,
		label: "dashboard",
		path: "/dashboard",
	},
	{
		icon: <CalendarBlank size={24} />,
		label: "plans",
		path: "/dashboard/plans",
	},
	{
		icon: <ListDashes size={24} />,
		label: "transactions",
		path: "/dashboard/transactions",
	},
	{
		icon: <User size={24} />,
		label: "profile",
		path: "/dashboard/profile",
	},
	{
		icon: <Stack size={24} />,
		label: "resources",
		path: "/dashboard/resources",
	},
	{
		icon: <Headset size={24} />,
		label: "help & support",
		path: "/dashboard/support",
	},
]
