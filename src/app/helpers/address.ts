import { validate, Network } from "bitcoin-address-validation"

export const validateWalletAddress = (
	address: string,
	network: Network = Network.mainnet
) => {
	if (!address) return false
	const env = process.env.NEXT_PUBLIC_APP_ENV || process.env.NODE_ENV
	if (env === "staging" || env === "development") return true
	return validate(address, network)
}
