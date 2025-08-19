"use client";

import { cn } from "@/lib/utills";
import { useAccount, useNetwork } from "@starknet-react/core";
import { ReactNode } from "react";

const DashboardLayout = ({
  title,
  children,
  className,
  availableNetwork,
}: {
  title: string;
  children?: ReactNode;
  className?: string;
  availableNetwork?: string[];
}) => {
  const { chain } = useNetwork();
  const { address } = useAccount();
  const isConnected = Boolean(address);
  const isTestnet = chain?.testnet;

  return (
    <main className="flex flex-col bg-fundable-mid-dark text-white text-base p-4 md:pt-6 md:pb-0 rounded-2xl h-full overflow-y-auto">
      <h1 className="font-syne font-medium border-b border-b-gray-700 pb-4 w-full">
        {title}
      </h1>
      <main
        className={cn("flex-1 my-4 h-full overflow-y-auto px-2", className)}
      >
        {(() => {
          const currentNormalizedNetwork = isTestnet ? "testnet" : "mainnet";

          if (!availableNetwork) return children;

          const isAvailableOnCurrentNetwork = availableNetwork.includes(
            currentNormalizedNetwork
          );

          const isAvailableOnMainnet = availableNetwork.includes("mainnet");
          const isAvailableOnTestnet = availableNetwork.includes("testnet");

          // If not available on any network, show under development
          if (!isAvailableOnMainnet && !isAvailableOnTestnet)
            return (
              <div className="flex flex-col items-center justify-center h-full">
                <h2 className="text-2xl font-syne font-medium mb-2">Coming Soon</h2>
                <p className="text-gray-400 text-center">
                  This feature is currently under development. Please check back later!
                </p>
              </div>
            );

          // If available only on one network, prompt user to switch (only when wallet is connected)
          if (!isAvailableOnCurrentNetwork) {
            const onlyOnMainnet = isAvailableOnMainnet && !isAvailableOnTestnet;
            const targetNetworkLabel = onlyOnMainnet ? "Mainnet" : "Testnet";

            return isConnected ? (
              <div className="flex flex-col items-center justify-center h-full">
                <h2 className="text-2xl font-syne font-medium mb-2">Switch Network</h2>
                <p className="text-gray-400 text-center">
                  This feature is currently only available on {targetNetworkLabel}. Please switch to {targetNetworkLabel} to use it.
                </p>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full">
                <h2 className="text-2xl font-syne font-medium mb-2">Connect Wallet</h2>
                <p className="text-gray-400 text-center">
                  Connect your wallet to continue.
                </p>
              </div>
            );
          }

          // Available on current network
          return children;
        })()}
      </main>
    </main>
  );
};

export default DashboardLayout;
