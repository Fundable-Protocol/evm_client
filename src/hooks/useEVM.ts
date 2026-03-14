import { useAppKit, useAppKitAccount, useAppKitProvider, useAppKitNetwork } from "@reown/appkit/react";
import { useCallback, useEffect, useRef } from "react";
import { useConnect } from "wagmi";
import { saveWalletAction } from "@/app/actions/saveWalletActions";
import { useIsMiniApp } from "@/components/MiniKitInit";

export const useEVM = () => {
  const { open, close } = useAppKit();
  const { address, isConnected } = useAppKitAccount();
  const { walletProvider } = useAppKitProvider("eip155");
  const { chainId } = useAppKitNetwork();
  const { connect, connectors } = useConnect();
  const isMiniApp = useIsMiniApp();
  const previousChainId = useRef(chainId);
  const savedWalletRef = useRef<string | null>(null);

  const handleConnect = useCallback(() => {
    if (isMiniApp) {
      // Inside Farcaster/Base: connect using the embedded wallet connector
      const farcasterConnector = connectors.find(
        (c) => c.id === 'farcasterMiniApp'
      );
      if (farcasterConnector) {
        connect({ connector: farcasterConnector });
      }
    } else {
      // Outside Farcaster: use the existing Reown AppKit modal
      open();
    }
  }, [isMiniApp, open, connect, connectors]);

  const handleDisconnect = useCallback(() => {
    // Disconnect is handled through the modal
    open({ view: "Account" });
  }, [open]);

  const handleSwitchNetwork = useCallback(() => {
    open({ view: "Networks" });
  }, [open]);

  // Save wallet to database when connected
  useEffect(() => {
    if (isConnected && address && address !== savedWalletRef.current) {
      console.log("💾 [useEVM] Saving wallet to database:", address);
      saveWalletAction({ walletAddress: address })
        .then((result) => {
          if (result?.wallet) {
            console.log("✅ [useEVM] Wallet saved successfully:", result.wallet);
            savedWalletRef.current = address;
          } else if (result?.message) {
            console.log("ℹ️ [useEVM] Wallet already exists or saved:", result.message);
            savedWalletRef.current = address;
          }
        })
        .catch((error) => {
          console.error("❌ [useEVM] Error saving wallet:", error);
        });
    } else if (!isConnected) {
      // Reset saved wallet ref when disconnected
      savedWalletRef.current = null;
    }
  }, [isConnected, address]);

  // Close modal when network changes
  useEffect(() => {
    if (previousChainId.current !== undefined && 
        previousChainId.current !== chainId && 
        chainId !== undefined) {
      // Close the modal when network changes
      close();
    }
    previousChainId.current = chainId;
  }, [chainId, close]);

  return {
    address,
    isConnected,
    walletProvider,
    chainId,
    isMiniApp,
    connect: handleConnect,
    disconnect: handleDisconnect,
    switchNetwork: handleSwitchNetwork,
  };
};