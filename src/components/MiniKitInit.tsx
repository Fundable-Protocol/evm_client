'use client';

import { useEffect, useState, createContext, useContext } from 'react';
import { useMiniKit } from '@coinbase/onchainkit/minikit';
import { useConnect, useAccount } from 'wagmi';
import { sdk } from '@farcaster/miniapp-sdk';

// Context to share mini app state across the app
const MiniAppContext = createContext(false);

export function useIsMiniApp() {
  return useContext(MiniAppContext);
}

function MiniKitInitInner() {
  const { setFrameReady, isFrameReady } = useMiniKit();
  const { connect, connectors } = useConnect();
  const { isConnected } = useAccount();

  // Dismiss splash screen
  useEffect(() => {
    if (!isFrameReady) {
      setFrameReady();
    }
  }, [setFrameReady, isFrameReady]);

  // Auto-connect to embedded wallet when inside Farcaster/Base
  useEffect(() => {
    async function autoConnect() {
      const isMiniApp = await sdk.isInMiniApp();
      if (isMiniApp && !isConnected) {
        // Find the Farcaster Mini App connector
        const farcasterConnector = connectors.find(
          (c) => c.id === 'farcasterMiniApp'
        );
        if (farcasterConnector) {
          connect({ connector: farcasterConnector });
        }
      }
    }
    autoConnect();
  }, [connect, connectors, isConnected]);

  return null;
}

export function MiniKitInit({ children }: { children: React.ReactNode }) {
  const [isMiniApp, setIsMiniApp] = useState(false);

  useEffect(() => {
    sdk.isInMiniApp().then(setIsMiniApp);
  }, []);

  return (
    <MiniAppContext.Provider value={isMiniApp}>
      <MiniKitInitInner />
      {children}
    </MiniAppContext.Provider>
  );
}
