"use client";

import { cn } from "@/lib/utils";
import { useAccount, useNetwork } from "@starknet-react/core";
import { ReactNode } from "react";
import { AlertTriangle, Info, AlertCircle } from "lucide-react";

const ComingSoon = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h2 className="text-2xl font-syne font-medium mb-2">Coming Soon!</h2>
      <p className="text-gray-400 text-center">
        This feature is currently under development. Please check back later. 😎
      </p>
    </div>
  );
};

const NetworkSwitch = ({
  children,
  isConnected,
  targetNetworkLabel,
  isAvailableOnCurrentNetwork,
}: {
  children: ReactNode;
  isConnected: boolean;
  targetNetworkLabel: string;
  isAvailableOnCurrentNetwork: boolean;
}) => {
  if (!isAvailableOnCurrentNetwork) {
    return isConnected ? (
      <div className="flex flex-col items-center justify-center h-full">
        <h2 className="text-2xl font-syne font-medium mb-2">Switch Network</h2>
        <p className="text-gray-400 text-center">
          This feature is currently only available on {targetNetworkLabel}.
          Please switch to {targetNetworkLabel} to use it.
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

  return children;
};

export interface InfoMessage {
  type: "info" | "warning" | "error";
  title?: string;
  message: string;
  showOnNetwork?: "mainnet" | "testnet" | "both";
}

const InlineInfoMessage = ({
  infoMessage,
  currentNetwork,
}: {
  infoMessage: InfoMessage;
  currentNetwork: string;
}) => {
  if (infoMessage.showOnNetwork && infoMessage.showOnNetwork !== "both") {
    if (infoMessage.showOnNetwork !== currentNetwork) return null;
  }

  const getIconAndStyles = () => {
    switch (infoMessage.type) {
      case "warning":
        return {
          icon: <AlertTriangle className="w-4 h-4" />,
          textColor: "text-yellow-400",
          iconColor: "text-yellow-500",
        };
      case "error":
        return {
          icon: <AlertCircle className="w-4 h-4" />,
          textColor: "text-red-400",
          iconColor: "text-red-500",
        };
      case "info":
      default:
        return {
          icon: <Info className="w-4 h-4" />,
          textColor: "text-blue-400",
          iconColor: "text-blue-500",
        };
    }
  };

  const styles = getIconAndStyles();

  return (
    <div className="flex items-center gap-2 ml-auto md:ml-auto">
      <div className={styles.iconColor}>{styles.icon}</div>
      <span className={cn("text-sm", styles.textColor)}>
        {infoMessage.title && (
          <span className="font-semibold">{infoMessage.title}: </span>
        )}
        {infoMessage.message}
      </span>
    </div>
  );
};

const DashboardLayout = ({
  title,
  children,
  className,
  availableNetwork = [],
  infoMessage,
}: {
  title: string;
  children?: ReactNode;
  className?: string;
  availableNetwork?: string[];
  infoMessage?: InfoMessage;
}) => {
  const { chain } = useNetwork();
  const { address } = useAccount();
  const isConnected = Boolean(address);
  const isTestnet = chain?.testnet;

  const currentNormalizedNetwork = isTestnet ? "testnet" : "mainnet";

  const isAvailableOnCurrentNetwork = availableNetwork.includes(
    currentNormalizedNetwork
  );

  const isAvailableOnMainnet = availableNetwork.includes("mainnet");
  const isAvailableOnTestnet = availableNetwork.includes("testnet");

  const onlyOnMainnet = isAvailableOnMainnet && !isAvailableOnTestnet;

  return (
    <main className="flex flex-col bg-fundable-mid-dark text-white text-base p-4 md:pt-6 md:pb-0 rounded-2xl h-full overflow-y-auto">
      <div className="border-b border-b-gray-700 pb-4 w-full">
        {/* Desktop: Title and info message on same line */}
        <div className="hidden md:flex items-center">
          <h1 className="font-syne font-medium">{title}</h1>
          {infoMessage && isAvailableOnCurrentNetwork && isConnected && (
            <InlineInfoMessage
              infoMessage={infoMessage}
              currentNetwork={currentNormalizedNetwork}
            />
          )}
        </div>

        {/* Mobile: Title and info message stacked */}
        <div className="md:hidden">
          <h1 className="font-syne font-medium">{title}</h1>
          {infoMessage && isAvailableOnCurrentNetwork && (
            <div className="mt-2">
              <InlineInfoMessage
                infoMessage={infoMessage}
                currentNetwork={currentNormalizedNetwork}
              />
            </div>
          )}
        </div>
      </div>

      <main
        className={cn("flex-1 my-4 h-full overflow-y-auto px-2", className)}
      >
        {!availableNetwork.length ? (
          <ComingSoon />
        ) : (
          <NetworkSwitch
            isConnected={isConnected}
            targetNetworkLabel={onlyOnMainnet ? "Mainnet" : "Testnet"}
            isAvailableOnCurrentNetwork={isAvailableOnCurrentNetwork}
          >
            {children}
          </NetworkSwitch>
        )}
      </main>
    </main>
  );
};

export default DashboardLayout;
