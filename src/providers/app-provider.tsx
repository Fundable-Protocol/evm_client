"use client";

import React, { ReactNode } from "react";
import { Toaster } from "react-hot-toast";

import { StarknetProvider } from "./starknet-provider";
import TanstackQueryProvider from "./tanstack-query-provider";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/ui/app-sidebar";
import AdminNavbar from "@/components/organisms/AdminNavbar";

const AppProvider = ({ children }: { children: ReactNode }) => {
  return (
    <main>
      <TanstackQueryProvider>
        <StarknetProvider>
          <SidebarProvider>
            <AppSidebar />
            <main className="flex flex-col h-dvh w-full overflow-hidden">
              <AdminNavbar />
              <div className="px-4 py-4 overflow-hidden">{children}</div>
            </main>
          </SidebarProvider>
        </StarknetProvider>
      </TanstackQueryProvider>
      <Toaster position="bottom-right" />
    </main>
  );
};

export default AppProvider;
