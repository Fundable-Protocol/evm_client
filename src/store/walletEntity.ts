// store/wallet.ts
import { entity } from "simpler-state";

export interface WalletEntityProps {
  address?: string | null;
  isConnected?: boolean;
}

const walletEntity = entity<WalletEntityProps>({
  address: "",
  isConnected: false,
});

export const setWallet = ({ address, isConnected }: WalletEntityProps) => {
  walletEntity.set({ address, isConnected });
};

export default walletEntity;
