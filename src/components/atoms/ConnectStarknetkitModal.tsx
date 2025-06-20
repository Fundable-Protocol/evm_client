import GradientButton, { ConnectWalletBtnProps } from "./GradientButton";
import { useConnectWallet } from "@/hooks/useConnectWallet";

const ConnectStarknetkitModal = ({ type, onClick }: ConnectWalletBtnProps) => {
  const { connectWallet } = useConnectWallet();

  const handleWalletConnect = async () => {
    onClick?.();

    await connectWallet();
  };

  return (
    <GradientButton
      title="Connect Wallet"
      type={type}
      onClick={handleWalletConnect}
    />
  );
};

export default ConnectStarknetkitModal;
