import { StarknetkitConnector, useStarknetkitConnectModal } from "starknetkit";
import {
  Connector,
  useAccount,
  useConnect,
  useDisconnect,
} from "@starknet-react/core";
import SecureLS from "secure-ls";
import { setWallet } from "@/store/walletEntity";
import { useEffect, useCallback, useRef, useState } from "react";
import { saveWalletAction } from "@/app/actions/saveWalletActions";

export function useConnectWallet() {
  const { address } = useAccount();
  const { disconnect } = useDisconnect();
  const { connectAsync, connectors } = useConnect();
  const [hasMounted, setHasMounted] = useState(false);

  // Use refs to store memoized functions
  const lsRef = useRef(
    typeof window !== "undefined" ? new SecureLS({ encodingType: "aes" }) : null
  );

  const checkPrevConnection = () => {
    if (typeof window !== "undefined") {
      return lsRef?.current?.get("aktInfo")?.isPrevConnected || false;
    }

    return false;
  };

  const [isPrevConnected, setIsPrevConnected] = useState(checkPrevConnection);

  // Track mount state
  useEffect(() => {
    setHasMounted(true);
  }, []);

  // Handle auto-reconnection timeout
  useEffect(() => {
    if (hasMounted && isPrevConnected && !address) {
      const timer = setTimeout(() => {
        // Auto-reconnection failed, reset isPrevConnected
        setIsPrevConnected(false);
        lsRef.current?.set("aktInfo", {
          isPrevConnected: false,
          address: undefined,
        });
      }, 1000); // 3 second timeout for auto-reconnection

      return () => clearTimeout(timer);
    }
  }, [hasMounted, isPrevConnected, address]);

  // Move the success handler to useEffect to avoid re-renders
  useEffect(() => {
    const saveWallet = async () => {
      await saveWalletAction({ walletAddress: address as string });
    };

    if (address) {
      setWallet({ isConnected: true, address });

      const newInfo = { isPrevConnected: true, address };

      lsRef.current?.set("aktInfo", newInfo);

      setIsPrevConnected(true);

      saveWallet();
    } else {
      // Only reset isPrevConnected to false if user was NOT previously connected

      // This prevents flickering during wallet reconnection after browser restart

      const currentInfo = lsRef.current?.get("aktInfo");

      if (!currentInfo?.isPrevConnected) {
        lsRef.current?.set("aktInfo", {
          isPrevConnected: false,
          address: undefined,
        });

        setIsPrevConnected(false);
      }
    }
  }, [address]);

  const { starknetkitConnectModal } = useStarknetkitConnectModal({
    connectors: connectors as StarknetkitConnector[],
    modalTheme: "system",
  });

  const connectWallet = useCallback(async () => {
    try {
      const { connector } = await starknetkitConnectModal();
      if (!connector) {
        setWallet({
          isConnected: false,
          address: "",
        });

        return;
      }


      await connectAsync({ connector: connector as Connector });

      setWallet({
        isConnected: true,
      });
    } catch {}
  }, [starknetkitConnectModal, connectAsync]);

  const disConnectWallet = useCallback(() => {
    disconnect();

    setWallet({
      isConnected: false,
      address: "",
    });

    // Explicitly set isPrevConnected to false on manual disconnect
    lsRef.current?.set("aktInfo", {
      isPrevConnected: false,
      address: undefined,
    });
    setIsPrevConnected(false);
  }, [disconnect]);

  return {
    address,
    disConnectWallet,
    connectWallet,
    isConnected: Boolean(address),
    isPrevConnected,
  };
}
