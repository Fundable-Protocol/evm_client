"use client";

import { wagmiAdapter, projectId, networks } from '@/config'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createAppKit } from '@reown/appkit/react'
import { base, AppKitNetwork } from '@reown/appkit/networks'
import React, { type ReactNode } from 'react'
import { cookieToInitialState, WagmiProvider, type Config } from 'wagmi'
import { Toaster, ToastBar, toast } from "react-hot-toast"
import { CheckCircle2, XCircle, Loader2, X } from "lucide-react"
import { MiniKitContextProvider } from './minikit-provider'
import { MiniKitInit } from '@/components/MiniKitInit'
import { SidebarProvider } from '@/components/ui/sidebar'
import AdminNavbar from '@/components/organisms/AdminNavbar'
import { AppSidebar } from '@/components/ui/app-sidebar'

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
        <MiniKitContextProvider>
          <MiniKitInit />
          <SidebarProvider>
            <AppSidebar />
            <main className="flex flex-col h-dvh w-full overflow-hidden">
              <AdminNavbar />
              <div className="px-4 py-4 overflow-hidden pb-16 sm:pb-20 md:pb-4">{children}</div>
              <Toaster
                position="bottom-right"
                toastOptions={{
                  duration: 4000,
                  style: {
                    background: 'var(--card)',
                    color: 'var(--card-foreground)',
                    border: '1px solid var(--border)',
                    borderRadius: '0.75rem',
                    padding: '0',
                    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(255, 255, 255, 0.05)',
                    maxWidth: '420px',
                  },
                  success: {
                    iconTheme: {
                      primary: '#10b981',
                      secondary: 'white',
                    },
                  },
                  error: {
                    iconTheme: {
                      primary: '#ef4444',
                      secondary: 'white',
                    },
                  },
                  loading: {
                    iconTheme: {
                      primary: 'var(--fundable-purple)',
                      secondary: 'transparent',
                    },
                  },
                }}
              >
                {(t) => (
                  <ToastBar toast={t}>
                    {({ icon, message }) => (
                      <div className="flex items-center gap-3 p-4 w-full">
                        <div className="flex-shrink-0">
                          {t.type === 'success' && (
                            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-green-500/20">
                              <CheckCircle2 className="w-5 h-5 text-green-500" />
                            </div>
                          )}
                          {t.type === 'error' && (
                            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-red-500/20">
                              <XCircle className="w-5 h-5 text-red-500" />
                            </div>
                          )}
                          {t.type === 'loading' && (
                            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-fundable-purple/20">
                              <Loader2 className="w-5 h-5 text-fundable-purple animate-spin" />
                            </div>
                          )}
                          {(!t.type || t.type === 'blank') && icon}
                        </div>
                        <div className="flex-1 text-sm font-medium text-foreground">
                          {message}
                        </div>
                        {t.type !== 'loading' && (
                          <button
                            onClick={() => toast.dismiss(t.id)}
                            className="flex-shrink-0 p-1 rounded-md hover:bg-accent transition-colors"
                            aria-label="Close"
                          >
                            <X className="w-4 h-4 text-muted-foreground" />
                          </button>
                        )}
                      </div>
                    )}
                  </ToastBar>
                )}
              </Toaster>
            </main>
          </SidebarProvider>
        </MiniKitContextProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}

export default AppProvider
