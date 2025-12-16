"use client"
import {
	ResponsiveContainer,
	AreaChart,
	Area,
	XAxis,
	YAxis,
	Tooltip,
} from "recharts"
import { useEffect, useMemo, useState } from "react"
import * as Select from "@radix-ui/react-select"
import { ChevronDownIcon } from "@radix-ui/react-icons"

type Range = "ONE_DAY" | "ONE_WEEK" | "ONE_MONTH" | "ONE_YEAR" | "FIVE_YEARS"
type Currency = "NGN" | "USD"

type PricePoint = {
	timestamp: number
	priceUsd: number
	priceNgn: number
}

const GRAPHQL_ENDPOINT = "https://api.blink.sv/graphql"

const formatNaira = (value: number) =>
	`₦${value.toLocaleString(undefined, {
		maximumFractionDigits: 0,
	})}`

const formatUsd = (value: number) =>
	`$${value.toLocaleString(undefined, {
		minimumFractionDigits: 2,
		maximumFractionDigits: 2,
	})}`

const formatCompactNumber = (value: number, currency: Currency) => {
	const prefix = currency === "NGN" ? "₦" : "$"
	const absValue = Math.abs(value)

	if (absValue >= 1_000_000_000) {
		return `${prefix}${(value / 1_000_000_000).toFixed(1)}B`
	}
	if (absValue >= 1_000_000) {
		return `${prefix}${(value / 1_000_000).toFixed(1)}M`
	}
	if (absValue >= 1_000) {
		return `${prefix}${(value / 1_000).toFixed(1)}K`
	}
	return currency === "NGN" ? formatNaira(value) : formatUsd(value)
}

export default function BtcPriceChart() {
	const [data, setData] = useState<PricePoint[]>([])
	const [range, setRange] = useState<Range>("ONE_WEEK")
	const [currency, setCurrency] = useState<Currency>("NGN")
	const [loading, setLoading] = useState(true)
	const [isChangingRange, setIsChangingRange] = useState(false)

	useEffect(() => {
		const fetchPrices = async () => {
			const isInitialLoad = data.length === 0
			if (!isInitialLoad) {
				setIsChangingRange(true)
			} else {
				setLoading(true)
			}

			const response = await fetch(
				"https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/usd.json"
			)
			const responseData = await response.json()
			const ngnRate = responseData.usd.ngn

			try {
				const res = await fetch(GRAPHQL_ENDPOINT, {
					method: "POST",
					headers: { "content-type": "application/json" },
					body: JSON.stringify({
						query: `
              query ($range: PriceGraphRange!) {
                btcPriceList(range: $range) {
                  price { formattedAmount }
                  timestamp
                }
              }
            `,
						variables: { range },
					}),
				})

				const json = await res.json()

				const formatted: PricePoint[] = json.data.btcPriceList.map((item: any) => {
					const priceUsd = Number(item.price.formattedAmount) / 100
					const priceNgn = priceUsd * ngnRate

					return {
						timestamp: item.timestamp * 1000,
						priceUsd,
						priceNgn,
					}
				})

				setData(formatted)
			} catch (err) {
				console.error("BTC chart fetch failed", err)
			} finally {
				if (isInitialLoad) {
					setLoading(false)
				} else {
					setIsChangingRange(false)
				}
			}
		}

		fetchPrices()
	}, [range, data.length])

	const delta = useMemo(() => {
		if (data.length < 2) return null
		const priceKey = currency === "NGN" ? "priceNgn" : "priceUsd"
		const start = data[0][priceKey]
		const end = data[data.length - 1][priceKey]

		return ((end - start) / start) * 100
	}, [data, currency])

	const formatTime = (value: number) => {
		const date = new Date(value)

		switch (range) {
			case "ONE_DAY":
				return date.toLocaleTimeString([], {
					hour: "2-digit",
					minute: "2-digit",
				})
			case "ONE_WEEK":
				return date.toLocaleDateString([], { weekday: "short" })
			case "ONE_MONTH":
				return date.toLocaleDateString([], {
					day: "numeric",
					month: "short",
				})
			case "ONE_YEAR":
				return date.toLocaleDateString([], { month: "short" })
			case "FIVE_YEARS":
				return date.getFullYear().toString()
		}
	}

	const formatPrice = (value: number) => {
		console.log({ nairaprice: formatNaira(value), usdPrice: formatUsd(value) })
		return currency === "NGN" ? formatNaira(value) : formatUsd(value)
	}

	if (loading) {
		return (
			<div className="flex h-full items-center justify-center text-sm text-gray-400">
				Loading market data…
			</div>
		)
	}

	const priceDataKey = currency === "NGN" ? "priceNgn" : "priceUsd"

	const rangeOptions = [
		{ value: "ONE_DAY", label: "1 Day" },
		{ value: "ONE_WEEK", label: "1 Week" },
		{ value: "ONE_MONTH", label: "1 Month" },
		{ value: "ONE_YEAR", label: "1 Year" },
		{ value: "FIVE_YEARS", label: "5 Years" },
	]

	return (
		<div className="flex h-full w-full flex-col gap-4 p-4">
			{/* Header */}
			<div className="flex items-start justify-between md:flex-col md:gap-y-2">
				<div>
					<p className="text-sm text-gray-500">BTC Price ({currency})</p>
					{delta !== null && (
						<p
							className={`text-lg font-semibold ${
								delta >= 0 ? "text-green-500" : "text-red-500"
							}`}>
							{delta >= 0 ? "+" : ""}
							{delta.toFixed(2)}%
						</p>
					)}
				</div>

				<div className="flex w-full items-center gap-3 md:justify-start lg:justify-end">
					<Select.Root
						value={range}
						onValueChange={(value) => setRange(value as Range)}>
						<Select.Trigger className="bg-white border-white inline-flex min-w-[120px] items-center justify-between gap-2 rounded-lg border px-4 py-2 text-sm font-medium text-white-100 shadow-sm focus:outline-none">
							<Select.Value />
							<Select.Icon>
								<ChevronDownIcon className="h-4 w-4 text-gray-500" />
							</Select.Icon>
						</Select.Trigger>

						<Select.Portal>
							<Select.Content className="bg-black z-50 overflow-hidden rounded-lg shadow-lg">
								<Select.Viewport className="bg-white-100 p-1">
									{rangeOptions.map((option) => (
										<Select.Item
											key={option.value}
											value={option.value}
											className="hover:text-black data-[state=checked]:bg-white data-[state=checked]:text-black text-black relative flex cursor-pointer items-center rounded-md px-4 py-2.5 text-sm outline-none hover:bg-gray-800/50 focus:bg-gray-800/50 data-[state=checked]:font-medium">
											<Select.ItemText>{option.label}</Select.ItemText>
										</Select.Item>
									))}
								</Select.Viewport>
							</Select.Content>
						</Select.Portal>
					</Select.Root>

					<button
						onClick={() => setCurrency(currency === "NGN" ? "USD" : "NGN")}
						className="text-white rounded-lg bg-alt-orange-100 px-4 py-2 text-sm font-medium shadow-sm transition-colors hover:bg-alt-orange-100/85">
						{currency}
					</button>
				</div>
			</div>

			<div className="min-h-0 flex-1">
				{isChangingRange ? (
					<div className="flex h-full items-center justify-center text-sm text-gray-400">
						Loading...
					</div>
				) : (
					<ResponsiveContainer width="100%" height="100%">
						<AreaChart data={data}>
							<defs>
								<linearGradient id="btcBgGradient" x1="0" y1="0" x2="0" y2="1">
									<stop offset="0%" stopColor="#FF8A00" stopOpacity={0.45} />
									<stop offset="100%" stopColor="#FF8A00" stopOpacity={0.05} />
								</linearGradient>
							</defs>

							<XAxis
								dataKey="timestamp"
								tickFormatter={formatTime}
								stroke="#999"
								style={{ fontSize: "12px" }}
							/>

							<YAxis
								stroke="#999"
								tickFormatter={(v) => formatCompactNumber(v, currency)}
								domain={[
									(dataMin: number) => dataMin * 0.98,
									(dataMax: number) => dataMax * 1.02,
								]}
								width={70}
								style={{ fontSize: "12px" }}
							/>

							<Tooltip
								formatter={(value) => {
									if (typeof value !== "number") return ["-", currency]
									return [formatPrice(value), currency]
								}}
								labelFormatter={(label) => new Date(label).toLocaleString()}
								contentStyle={{
									backgroundColor: "rgba(255, 255, 255, 0.95)",
									border: "1px solid #e5e7eb",
									borderRadius: "6px",
									fontSize: "12px",
								}}
							/>

							<Area
								type="monotone"
								dataKey={priceDataKey}
								fill="url(#btcBgGradient)"
								stroke="#FF8A00"
								strokeOpacity={0.25}
								strokeWidth={1.5}
								dot={false}
								isAnimationActive
								animationDuration={900}
							/>
						</AreaChart>
					</ResponsiveContainer>
				)}
			</div>
		</div>
	)
}
