"use client";

import React, { ReactNode } from "react";
import { Toaster } from "react-hot-toast";

import { StarknetProvider } from "./starknet-provider";

const AppProvider = ({ children }: { children: ReactNode }) => {
  return (
    <main>
      <StarknetProvider>{children}</StarknetProvider>;
      <Toaster position="bottom-right" />
    </main>
  );
};

export default AppProvider;
