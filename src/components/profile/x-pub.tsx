"use client"
import { UserProps } from "@/types/profile"
import Image from "next/image"
import Button from "../shared/button"
import { PencilLine, Copy } from "@phosphor-icons/react"
import { useEffect, useState } from "react"
import CustomDialog from "../dialog"
import Input from "../shared/input"

export default function Xpub(props: UserProps) {
	const [popTypeOpen, setPopTypeOpen] = useState<"new" | "edit" | "">("")

	const handleOpenPOP = (value: "new" | "edit" | "") => {
		setPopTypeOpen(value)
	}

	useEffect(() => {
		console.log(popTypeOpen)
	}, [popTypeOpen])

	return (
		<div className="flex min-h-screen w-full flex-col rounded-md border border-[#494949]">
			<div className="flex flex-col items-center justify-between gap-y-8 border-b border-b-[#494949] px-6 py-6 md:flex-row md:gap-y-2">
				<div className="flex flex-col gap-y-2 md:max-w-[50%]">
					<h1 className="font-bold">Configure your xpub</h1>
					<small className="text-[#AAAAAA]">
						Your xpub (Extended Public Key) lets you generate multiple Bitcoin
						addresses from one master key without exposing your private keys.
					</small>
				</div>

				<Button
					type="button"
					className="rounded-md bg-alt-orange-100 px-2 py-4 md:min-w-[147px]"
					onClick={() => handleOpenPOP("new")}>
					Add new xpub
				</Button>
			</div>
			{/* <div className="w-full flex justify-center items-center">
				<div className="flex w-2/4 flex-col items-center justify-center gap-8">
					<div className="h-1/4 w-2/4">
						<Image
							src="/no_xpub.svg"
							alt="no-items"
							width={100}
							height={100}
							className="h-full w-full"
						/>
					</div>
					<h1>No Xpub added Yet</h1>
				</div>
			</div> */}

			<div className="flex w-full flex-col gap-y-4">
				<div className="flex w-full flex-col items-center justify-between gap-y-6 px-6 py-6 lg:flex-row lg:gap-y-0">
					<div className="flex w-full flex-col gap-y-4 lg:max-w-[50%]">
						<small className="text-[#aaaaaa]">Timi’s Jade Wallet</small>
						<small className="text-wrap break-words">
							xpub6CUGRUonZSQ4TWtTMmzXdrXDtypWKiKpR1y77jH2xJ4jGkQozvE1zJYgKr8tS93iq4zdbxqM3rP3Kbi3xR74fGkkttrmqm9ECpMxZz1KqAq
						</small>
					</div>

					<div className="flex w-full justify-end gap-x-3 md:min-w-[50%]">
						<Button className="rounded-md border border-[#494949] bg-[#000] px-2 py-4 text-[#B31919] md:min-w-[147px]">
							Delete xpub
						</Button>
						<Button className="flex items-center justify-center rounded-md border border-[#494949] bg-[#2B2B2B] px-2 py-4 md:min-w-[147px]">
							{<PencilLine size={20} className="mr-2" />} Edit xpub
						</Button>
					</div>
				</div>
			</div>

			<CustomDialog
				onDismiss={() => handleOpenPOP("")}
				isOpen={popTypeOpen === "new" || popTypeOpen === "edit"}>
				<div className="flex w-full flex-col gap-6">
					<div className="flex flex-col gap-2">
						<h2 className="text-white text-2xl font-semibold">Add new Xpub</h2>
						<p className="text-sm text-gray-400">
							Retrieve your xpub key from your hardware wallet
						</p>
					</div>

					<div className="flex flex-col gap-4">
						<Input
							as="input"
							typed="text"
							name="alias"
							label="Xpub Alias*"
							placeholder="Enter your alias"
							value={""}
							onChange={(e) => () => {}}
							width="w-full"
						/>

						<Input
							as="input"
							typed="text"
							name="keys"
							label="Xpub Keys*"
							placeholder="Enter your xpub keys"
							value={""}
							onChange={(e) => () => {}}
							width="w-full"
							pasteBtn={
								<button
									type="button"
									// onClick={handlePaste}
									className="flex items-center gap-1 text-xs font-medium text-[#199B2E] transition-colors">
									PASTE
									<Copy size={16} />
								</button>
							}
						/>
					</div>

					<div className="flex w-full gap-4 pt-4">
						<Button
							// onClick={onCancel}
							className="flex w-1/2 items-center justify-center rounded-md border border-[#494949] bg-[#2B2B2B] px-2 py-4 md:min-w-[147px]"
							textSize="text-sm">
							Cancel
						</Button>
						<Button
							textSize="text-sm"
							className="flex w-1/2 items-center justify-center rounded-md border border-[#494949] bg-alt-orange-100 px-2 py-4 md:min-w-[147px]">
							Save Xpub
						</Button>
					</div>
				</div>
			</CustomDialog>
		</div>
	)
}
