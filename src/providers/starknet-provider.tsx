"use client";

import { StarknetConfig, publicProvider, voyager } from "@starknet-react/core";
import { sepolia, mainnet } from "@starknet-react/chains";
import { getAvailableConnectors } from "@/lib/connectors";

// import { RpcProvider, constants } from "starknet";

export function StarknetProvider({ children }: { children: React.ReactNode }) {
  const connectors = getAvailableConnectors();

  if (connectors.length === 0) return null; // or a loader

  return (
    <StarknetConfig
      chains={[mainnet, sepolia]}
      provider={publicProvider()}
      connectors={connectors}
      explorer={voyager}
      autoConnect={true}
    >
      {children}
    </StarknetConfig>
  );
}
