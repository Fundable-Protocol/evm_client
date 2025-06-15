import { useAppKit, useAppKitAccount, useAppKitProvider } from "@reown/appkit/react";
import { useCallback } from "react";

export const useEVM = () => {
  const { open } = useAppKit();
  const { address, isConnected } = useAppKitAccount();
  const { walletProvider } = useAppKitProvider("eip155");

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

  return {
    address,
    isConnected,
    walletProvider,
    connect: handleConnect,
    disconnect: handleDisconnect,
    switchNetwork: handleSwitchNetwork,
  };
}; 