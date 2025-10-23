"use client";

import {
  voyager,
  Connector,
  StarknetConfig,
  jsonRpcProvider,
} from "@starknet-react/core";
import { sepolia, mainnet, Chain } from "@starknet-react/chains";
import { getAvailableConnectors } from "@/lib/connectors";
import { useEffect, useState } from "react";

const rpcCallback = (chain: Chain) => {
  if (["mainnet", "mainnet-alpha"].includes(chain.network?.toLowerCase())) {
    return { nodeUrl: "https://starknet-mainnet.public.blastapi.io" };
  }
  return { nodeUrl: "https://starknet-sepolia.public.blastapi.io" };
};

export const provider = jsonRpcProvider({ rpc: rpcCallback });

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

  // const rpc = useCallback((chain: Chain) => {
  //   if (["mainnet", "mainnet-alpha"].includes(chain.network?.toLowerCase())) {
  //     return { nodeUrl: "https://starknet-mainnet.public.blastapi.io" };
  //   }

  //   return { nodeUrl: "https://starknet-sepolia.public.blastapi.io" };
  // }, []);

  // export const provider = jsonRpcProvider({ rpc });

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
