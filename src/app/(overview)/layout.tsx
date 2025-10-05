import { ReactNode } from "react";

import AdminNavbar from "@/components/organisms/AdminNavbar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/ui/app-sidebar";

const layout = ({ children }: { children: ReactNode }) => {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="flex flex-col h-dvh w-full overflow-hidden">
        <AdminNavbar />
        <div className="px-4 py-4 overflow-hidden pb-16 sm:pb-20 md:pb-4">{children}</div>
      </main>
    </SidebarProvider>
  );
};

export default layout;
