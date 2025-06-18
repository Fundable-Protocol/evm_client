"use client";

import { wagmiAdapter, projectId, networks } from '@/config'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createAppKit } from '@reown/appkit/react'
import { base, AppKitNetwork } from '@reown/appkit/networks'
import React, { type ReactNode } from 'react'
import { cookieToInitialState, WagmiProvider, type Config } from 'wagmi'
import { Toaster } from "react-hot-toast"

// Set up queryClient
const queryClient = new QueryClient()

if (!projectId) {
  throw new Error('Project ID is not defined')
}

// Set up metadata
const metadata = {
  name: 'Fundable',
  description: "A decentralized funding application.",
  url: typeof window !== 'undefined' ? window.location.origin : '',
  icons: ["/favicon_io/favicon.ico"]
}

// Create the modal
createAppKit({
  adapters: [wagmiAdapter],
  projectId,
  networks: networks as unknown as [AppKitNetwork, ...AppKitNetwork[]],
  defaultNetwork: base,
  metadata: metadata,
  features: {
    analytics: true
  }
})

function AppProvider({ children, cookies }: { children: ReactNode; cookies: string | null }) {
  const initialState = cookieToInitialState(wagmiAdapter.wagmiConfig as Config, cookies)

  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig as Config} initialState={initialState}>
      <QueryClientProvider client={queryClient}>
        <main>
          {children}
          <Toaster position="bottom-right" />
        </main>
      </QueryClientProvider>
    </WagmiProvider>
  )
}

export default AppProvider
