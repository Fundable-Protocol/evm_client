"use client";

import {
  StarknetConfig,
  jsonRpcProvider,
  publicProvider,
  voyager,
  Connector,
} from "@starknet-react/core";
import { sepolia, mainnet, Chain } from "@starknet-react/chains";
import { getAvailableConnectors } from "@/lib/connectors";
import { useCallback, useEffect, useState } from "react";

// import { RpcProvider, constants } from "starknet";

export function StarknetProvider({ children }: { children: React.ReactNode }) {
  const [connectors, setConnectors] = useState<Connector[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadConnectors = async () => {
      try {
        // getAvailableConnectors is now async and handles Cartridge loading internally
        const allConnectors = await getAvailableConnectors();
        setConnectors(allConnectors);
      } catch (error) {
        console.error("Failed to load connectors:", error);
        setConnectors([]);
      } finally {
        setLoading(false);
      }
    };
    loadConnectors();
  }, []);

  const rpc = useCallback((chain: Chain) => {
    return {
      nodeUrl: "https://starknet-sepolia.public.blastapi.io",
    };
  }, []);

  if (connectors.length === 0) return null;

  const provider = jsonRpcProvider({ rpc });

  return (
    <StarknetConfig
      key={connectors ? "with-connector" : "no-connector"}
      chains={[mainnet, sepolia]}
      provider={provider}
      connectors={connectors}
      explorer={voyager}
      // autoConnect={true}
    >
      {children}
    </StarknetConfig>
  );
}
