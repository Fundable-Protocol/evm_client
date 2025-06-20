"use client";

import React, { ReactNode } from "react";
import { Toaster } from "react-hot-toast";

import { StarknetProvider } from "./starknet-provider";
import TanstackQueryProvider from "./tanstack-query-provider";

const AppProvider = ({ children }: { children: ReactNode }) => {
  return (
    <main>
      <TanstackQueryProvider>
        <StarknetProvider>{children}</StarknetProvider>;
      </TanstackQueryProvider>
      <Toaster position="bottom-right" />
    </main>
  );
};

export default AppProvider;
