import { StarknetkitConnector, useStarknetkitConnectModal } from "starknetkit";
import {
  Connector,
  useAccount,
  useConnect,
  useDisconnect,
} from "@starknet-react/core";
import SecureLS from "secure-ls";
import { setWallet } from "@/store/walletEntity";
import { useEffect, useCallback, useRef } from "react";

export function useConnectWallet() {
  const { address } = useAccount();
  const { disconnect } = useDisconnect();
  const { connectAsync, connectors } = useConnect();

  // Use refs to store memoized functions
  const lsRef = useRef(
    typeof window !== "undefined" ? new SecureLS({ encodingType: "aes" }) : null
  );

  const isPrevConnected =
    typeof window !== "undefined"
      ? lsRef?.current?.get("aktInfo")?.isPrevConnected
      : false;

  // Move the success handler to useEffect to avoid re-renders
  useEffect(() => {
    if (address) {
      setWallet({
        isConnected: true,
        address,
      });

      lsRef.current?.set("aktInfo", { isPrevConnected: true, address });
    } else {
      lsRef.current?.set("aktInfo", {
        isPrevConnected: false,
        address: undefined,
      });
    }
  }, [address]);

  const { starknetkitConnectModal } = useStarknetkitConnectModal({
    connectors: connectors as StarknetkitConnector[],
    modalTheme: "dark",
  });

  // Use useCallback to memoize functions
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
        address: "",
      });
    } catch {
      // console.log("ERRRRR::::", err);
    }
  }, [starknetkitConnectModal, connectAsync]);

  const disConnectWallet = useCallback(() => {
    disconnect();

    setWallet({
      isConnected: false,
      address: "",
    });

    lsRef.current?.remove("aktInfo");
  }, [disconnect]);

  return {
    address,
    disConnectWallet,
    connectWallet,
    isConnected: Boolean(address),
    isPrevConnected,
  };
}
