import { useAppKit, useAppKitAccount, useAppKitProvider, useAppKitNetwork } from "@reown/appkit/react";
import { useCallback, useEffect, useRef } from "react";

export const useEVM = () => {
  const { open, close } = useAppKit();
  const { address, isConnected } = useAppKitAccount();
  const { walletProvider } = useAppKitProvider("eip155");
  const { chainId } = useAppKitNetwork();
  const previousChainId = useRef(chainId);

  const handleConnect = useCallback(() => {
    open();
  }, [open]);

  const handleDisconnect = useCallback(() => {
    // Disconnect is handled through the modal
    open({ view: "Account" });
  }, [open]);

  const handleSwitchNetwork = useCallback(() => {
    open({ view: "Networks" });
  }, [open]);

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
    connect: handleConnect,
    disconnect: handleDisconnect,
    switchNetwork: handleSwitchNetwork,
  };
}; 