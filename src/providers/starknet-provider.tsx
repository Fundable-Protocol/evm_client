"use client";

import {
  StarknetConfig,
  jsonRpcProvider,
  voyager,
  Connector,
} from "@starknet-react/core";
import { sepolia, mainnet } from "@starknet-react/chains";
import { getAvailableConnectors } from "@/lib/connectors";
import { useCallback, useEffect, useState } from "react";

export function StarknetProvider({ children }: { children: React.ReactNode }) {
  const [connectors, setConnectors] = useState<Connector[]>([]);

  useEffect(() => {
    const loadConnectors = async () => {
      try {
        const loadedConnectors = await getAvailableConnectors();
        setConnectors(loadedConnectors);
      } catch {}
    };

    loadConnectors();
  }, []);

  const rpc = useCallback(() => {
    return { nodeUrl: "https://starknet-sepolia.public.blastapi.io" };
  }, []);

  const provider = jsonRpcProvider({ rpc });

  return (
    <StarknetConfig
      key={connectors.length > 0 ? "with-connectors" : "no-connectors"}
      chains={[mainnet, sepolia]}
      provider={provider}
      connectors={connectors} // Even if empty, let StarknetConfig handle it
      explorer={voyager}
      autoConnect={true}
    >
      {children}
    </StarknetConfig>
  );
}
