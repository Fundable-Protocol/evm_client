import { cookieStorage, createStorage } from '@wagmi/core'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { arbitrum, base, baseSepolia, sepolia, bsc, optimism, lisk, liskSepolia, mainnet, polygon } from '@reown/appkit/networks'
import { farcasterMiniApp } from '@farcaster/miniapp-wagmi-connector'

// Get projectId from https://cloud.reown.com
export const projectId = process.env.NEXT_PUBLIC_PROJECT_ID || "b56e18d47c72ab683b10814fe9495694"

if (!projectId) {
  throw new Error('Project ID is not defined')
}

export const networks = [arbitrum, base, baseSepolia, sepolia, bsc, optimism, lisk, liskSepolia, polygon]

// Set up the Wagmi Adapter (Config)
export const wagmiAdapter = new WagmiAdapter({
  storage: createStorage({
    storage: cookieStorage
  }),
  ssr: true,
  projectId,
  networks,
  connectors: [farcasterMiniApp()]
})

export const config = wagmiAdapter.wagmiConfig


export const mainnetWagmiAdapter = new WagmiAdapter({
  storage: createStorage({
    storage: cookieStorage
  }),
  ssr: true,
  projectId,
  networks: [mainnet]
})

export const mainnetConfig = mainnetWagmiAdapter.wagmiConfig
