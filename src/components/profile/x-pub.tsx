"use client"
import { UserProps } from "@/types/profile"
import { xpubInputProp } from "@/types/profile/index"
import Image from "next/image"
import Button from "../shared/button"
import { PencilLine, Copy } from "@phosphor-icons/react"
import React, { useCallback, useEffect, useState } from "react"
import CustomDialog from "../dialog"
import Input from "../shared/input"
import { WarningOctagon } from "@phosphor-icons/react/dist/ssr"
import { addXpub, deleteXpub, updateXpub } from "@/app/helpers/x-pub"
import { Dialog } from ".."
import { Spinner } from ".."

interface XpubProps extends UserProps {
	onWalletsUpdated?: () => void
}

export default function Xpub({
	physicalWallets,
	onWalletsUpdated,
	...props
}: XpubProps) {
	const [loading, setLoading] = useState<boolean>(false)
	const [editLoading, setEditLoading] = useState<boolean>(false)
	const [deleteLoading, setDeleteLoading] = useState<boolean>(false)
	const [error, setError] = useState("")
	const [selectedWallet, setSelectedWallet] = useState<
		UserProps["physicalWallets"][number] | null
	>(null)

	const [inputErrorState, setInputErrorState] = useState<xpubInputProp>({
		alias: "",
		pubKey: "",
	})

	const [inputState, setInputState] = useState<xpubInputProp>({
		alias: "",
		pubKey: "",
	})

	const [popTypeOpen, setPopTypeOpen] = useState<"new" | "edit" | "delete" | "">(
		""
	)

	const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target

		const updated = { ...inputState, [name]: value }
		setInputState(updated)

		setInputErrorState(checkErrors(updated.alias, updated.pubKey))
	}

	const clearInputState = () => {
		setInputState((prev) => ({ ...prev, alias: "", pubKey: "" }))
	}

	const dismissPOP = () => {
		handleOpenPOP("")
		clearInputState()
		setSelectedWallet(null)
	}

	const handleOpenPOP = (
		value: "new" | "edit" | "delete" | "",
		index?: number
	) => {
		if (index !== undefined && physicalWallets?.length > 0) {
			const wallet = physicalWallets[index]
			setSelectedWallet(wallet)

			if (value === "edit") {
				setInputState({
					alias: wallet.alias,
					pubKey: wallet.xpubKey,
				})
			}
		} else if (value === "") {
			setSelectedWallet(null)
			clearInputState()
		}

		setPopTypeOpen(value)
	}

	const checkErrors = (alias: string, pubKey: string) => {
		const errors = {
			alias: "",
			pubKey: "",
		}

		if (!alias.trim()) errors.alias = "Please add your pubkey alias"
		if (!pubKey.trim()) errors.pubKey = "Please add your public key"

		return errors
	}

	const errors = checkErrors(inputState.alias, inputState.pubKey)

	const handleSavenew = async () => {
		const validation = checkErrors(inputState.alias, inputState.pubKey)
		setInputErrorState(validation)
		if (validation.alias || validation.pubKey) return

		try {
			setLoading(true)
			const res = await addXpub(inputState)
			if (!res.success && res.status !== 200) {
				setLoading(false)
				return setError(res.message)
			}
			onWalletsUpdated?.()
			dismissPOP()
			setLoading(false)
		} catch (error) {
			if (error instanceof Error) {
				setError(error.message)
				setLoading(false)
			}
		}
	}

	const handleUpdatekey = async () => {
		const validation = checkErrors(inputState.alias, inputState.pubKey)
		setInputErrorState(validation)
		if (validation.alias || validation.pubKey) return

		try {
			setEditLoading(true)
			if (!selectedWallet) return
			const res = await updateXpub(selectedWallet.id, inputState)
			if (!res.success && res.status !== 200) {
				setEditLoading(false)
				// getAllXpubConfig()
				return setError(res.message)
			}
			onWalletsUpdated?.()
			dismissPOP()
			setEditLoading(false)
		} catch (error) {
			if (error instanceof Error) {
				setError(error.message)
				setLoading(false)
			}
		}
	}

	const handleDeletekey = async () => {
		try {
			setDeleteLoading(true)
			if (!selectedWallet) return
			const res = await deleteXpub(selectedWallet.id)
			if (!res.success && res.status !== 200) {
				setDeleteLoading(false)
				return setError(res.message)
			}
			onWalletsUpdated?.()
			dismissPOP()
			setDeleteLoading(false)
		} catch (error) {
			if (error instanceof Error) {
				setError(error.message)
				setDeleteLoading(false)
			}
		}
	}

	const pastepubKey = async () => {
		navigator.clipboard.readText().then((text) => {
			if (text) {
				setInputState({ ...inputState, pubKey: text })
			}
		})
	}

	return (
		<>
			<Dialog
				isOpen={Boolean(error)}
				onDismiss={() => setError("")}
				title="Failed to add xpub key"
				description={error}
				titleClassName={"text-red-500"}></Dialog>

			<div className="flex min-h-screen w-full flex-col rounded-md border border-[#494949]">
				<div className="flex flex-col items-center justify-between gap-y-8 border-b border-b-[#494949] px-6 py-6 md:flex-row md:gap-y-2">
					<div className="flex flex-col gap-y-2 md:max-w-[50%]">
						<h1 className="font-satoshi text-[16px] font-bold">
							Configure your xpub
						</h1>
						<small className="text-[14px] text-[#AAAAAA]">
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

				{physicalWallets.length === 0 ? (
					<div className="mt-24 flex w-full items-center justify-center lg:mt-8">
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
					</div>
				) : (
					<div className="flex w-full flex-col gap-y-4">
						{physicalWallets?.map((wallet, index) => (
							<div
								key={wallet.id}
								className="flex w-full flex-col items-center justify-between gap-y-6 px-6 py-6 font-satoshi lg:flex-row lg:gap-y-0">
								<div className="flex w-full flex-col gap-y-4 lg:max-w-[50%]">
									<small className="text-[14px] text-[#aaaaaa]">{wallet.alias}</small>
									<small className="text-wrap break-words text-[14px]">
										{wallet.xpubKey}
									</small>
								</div>

								<div className="flex w-full justify-end gap-x-3 md:min-w-[50%]">
									<Button
										onClick={() => handleOpenPOP("delete", index)}
										className="rounded-md border border-[#494949] bg-[#000] px-2 py-4 text-[16px] text-[#B31919] md:min-w-[147px]">
										Delete xpub
									</Button>
									<Button
										onClick={() => handleOpenPOP("edit", index)}
										className="flex items-center justify-center rounded-md border border-[#494949] bg-[#2B2B2B] px-2 py-4 text-[16px] md:min-w-[147px]">
										<PencilLine size={20} className="mr-2" /> Edit xpub
									</Button>
								</div>
							</div>
						))}
					</div>
				)}

				<CustomDialog
					onDismiss={() => dismissPOP()}
					isOpen={
						popTypeOpen === "new" ||
						popTypeOpen === "edit" ||
						popTypeOpen === "delete"
					}>
					<div className="flex w-full flex-col gap-6">
						{popTypeOpen === "new" || popTypeOpen === "edit" ? (
							<>
								<div className="flex flex-col gap-2">
									<h2 className="text-white text-2xl font-semibold">Add new Xpub</h2>
									<small className="text-sm text-[#808080]">
										Retrieve your xpub key from your hardware wallet
									</small>
								</div>

								<div className="flex flex-col gap-4">
									<Input
										as="input"
										typed="text"
										name="alias"
										label="Xpub Alias*"
										placeholder="Enter your alias"
										value={inputState.alias}
										onChange={handleInput}
										width="w-full"
										error={inputErrorState.alias}
									/>

									<Input
										as="input"
										typed="text"
										name="pubKey"
										label="Xpub Keys*"
										placeholder="Enter your xpub key"
										value={inputState.pubKey}
										onChange={handleInput}
										width="w-full"
										error={inputErrorState.pubKey}
										pasteBtn={
											<button
												type="button"
												onClick={pastepubKey}
												className="flex items-center gap-1 text-xs font-medium text-[#199B2E] transition-colors">
												PASTE
												<Copy size={16} />
											</button>
										}
									/>
								</div>

								<div className="flex w-full gap-4 pt-4">
									<Button
										onClick={dismissPOP}
										className="flex w-1/2 items-center justify-center rounded-md border border-[#494949] bg-[#2B2B2B] px-2 py-4 md:min-w-[147px]"
										textSize="text-sm">
										Cancel
									</Button>
									<Button
										onClick={() => {
											if (popTypeOpen === "new") {
												handleSavenew()
											} else {
												handleUpdatekey()
											}
										}}
										textSize="text-sm"
										className="flex w-1/2 items-center justify-center rounded-md border border-[#494949] bg-alt-orange-100 px-2 py-4 md:min-w-[147px]">
										{loading || editLoading ? <Spinner /> : "Save Xpub"}
									</Button>
								</div>
							</>
						) : popTypeOpen === "delete" ? (
							<>
								<div className="flex w-full justify-center">
									<WarningOctagon color="#B31919" size={80} weight="fill" />
								</div>

								<div className="flex w-full flex-col items-center justify-center gap-2">
									<h1 className="font-satoshi text-[36px] font-bold">Delete xpub</h1>
									<small className="text-[20px] text-[#808080]">
										Are you sure you want to delete this Xpub key?
									</small>
								</div>

								<div className="flex w-full gap-4 pt-4">
									<Button
										onClick={dismissPOP}
										className="flex w-1/2 items-center justify-center rounded-md border border-[#494949] bg-[#2B2B2B] px-2 py-4 md:min-w-[147px]"
										textSize="text-sm">
										No, cancel
									</Button>
									<Button
										onClick={handleDeletekey}
										textSize="text-sm"
										className="flex w-1/2 items-center justify-center rounded-md border border-[#494949] bg-alt-orange-100 px-2 py-4 md:min-w-[147px]">
										{deleteLoading ? <Spinner /> : "Yes, delete"}
									</Button>
								</div>
							</>
						) : null}
					</div>
				</CustomDialog>
			</div>
		</>
	)
}
