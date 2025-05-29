"use client";

import { useEffect } from "react";
import SecureLS from "secure-ls";

import { setWallet } from "@/store/walletEntity";

function WalletProvider() {
  useEffect(() => {
    const ls = new SecureLS({ encodingType: "aes" });

    const walletData = ls.get("aktInfo");

    if (!walletData?.isPrevConnected) {
      // remove cookies and delete data
    } else {
      setWallet({
        isConnected: walletData?.isPrevConnected ?? false,
        address: walletData?.address ?? "",
      });
    }
  }, []);

  return null;
}

export default WalletProvider;
