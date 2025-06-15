"use client";

import { useEVM } from "@/hooks/useEVM";
import GradientButton, { ConnectWalletBtnProps } from "./GradientButton";

const ConnectButton = ({ type, onClick }: ConnectWalletBtnProps) => {
  const { connect, isConnected } = useEVM();

  const handleConnect = () => {
    onClick?.();
    connect();
  };

  return (
    <GradientButton
      title={isConnected ? "Connected" : "Connect Wallet"}
      type={type}
      onClick={handleConnect}
    />
  );
};

export default ConnectButton; 