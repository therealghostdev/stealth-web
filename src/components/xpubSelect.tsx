"use client"

import * as React from "react"
import * as SelectPrimitive from "@radix-ui/react-select"
import {
	ChevronDownIcon,
	ChevronUpIcon,
	ChevronRightIcon,
} from "@radix-ui/react-icons"

interface XpubItem {
	id: number
	alias: string
	xpubKey: string
}

interface XpubSelectProps {
	items: XpubItem[]
	value?: number | null
	onValueChange: (id: number) => void
	placeholder?: string
	disabled?: boolean
}

const XpubSelect = React.forwardRef<HTMLButtonElement, XpubSelectProps>(
	(
		{
			items,
			value,
			onValueChange,
			placeholder = "Select Xpub",
			disabled = false,
		},
		ref
	) => {
		const selectedItem = items.find((item) => item.id === value)

		return (
			<SelectPrimitive.Root
				value={value?.toString() || ""}
				onValueChange={(v) => onValueChange(Number(v))}
				disabled={disabled}>
				<SelectPrimitive.Trigger
					ref={ref}
					className="text-white flex h-12 w-full items-center justify-between rounded-lg border border-[#494949] bg-[#111111] px-4 py-3 text-base placeholder:text-neutral-500 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 data-[placeholder]:text-[white]">
					<SelectPrimitive.Value placeholder={placeholder}>
						{selectedItem ? selectedItem.alias : placeholder}
					</SelectPrimitive.Value>
					<SelectPrimitive.Icon className="text-[#858585]">
						<ChevronDownIcon className="h-5 w-5" />
					</SelectPrimitive.Icon>
				</SelectPrimitive.Trigger>

				<SelectPrimitive.Portal>
					<SelectPrimitive.Content
						className="data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 relative z-50 w-[var(--radix-select-trigger-width)] min-w-[var(--radix-select-trigger-width)] overflow-hidden rounded-lg border border-[#494949] bg-[#010101] shadow-lg"
						position="popper"
						sideOffset={5}>
						<SelectPrimitive.ScrollUpButton className="flex cursor-pointer items-center justify-center py-1">
							<ChevronUpIcon className="h-4 w-4 text-[#858585]" />
						</SelectPrimitive.ScrollUpButton>

						<SelectPrimitive.Viewport className="p-0">
							{items.length > 0 ? (
								items.map((item) => (
									<SelectPrimitive.Item
										key={item.id}
										value={item.id.toString()}
										className="relative flex cursor-pointer select-none items-center justify-between border-b border-neutral-800 px-4 py-3 text-[#AAAAAA] outline-none transition-colors last:border-b-0 hover:bg-[#2B2B2B] focus:bg-[#2B2B2B] data-[state=checked]:bg-[#2B2B2B]">
										<div className="flex flex-1 flex-col gap-1 truncate font-satoshi">
											<SelectPrimitive.ItemText className="text-white truncate text-[14px]">
												{item.alias}
											</SelectPrimitive.ItemText>
											<div className="text-white truncate text-[14px] text-[#ffffff]">
												{item.xpubKey}
											</div>
										</div>
										<ChevronRightIcon className="ml-2 h-4 w-4 flex-shrink-0 text-[#858585]" />
									</SelectPrimitive.Item>
								))
							) : (
								<div className="py-6 text-center text-sm text-[#858585]">
									No items available
								</div>
							)}
						</SelectPrimitive.Viewport>

						<SelectPrimitive.ScrollDownButton className="flex cursor-pointer items-center justify-center py-1">
							<ChevronDownIcon className="h-4 w-4 text-neutral-400" />
						</SelectPrimitive.ScrollDownButton>
					</SelectPrimitive.Content>
				</SelectPrimitive.Portal>
			</SelectPrimitive.Root>
		)
	}
)

XpubSelect.displayName = "XpubSelect"

export { XpubSelect }
export type { XpubItem, XpubSelectProps }
