"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

import { User2, Banknote } from "lucide-react";
import { Sidebar, useSidebar } from "@/components/ui/sidebar";
import Logo from "../../../public/svgs/fundable_logo.svg";

import { useEVM } from "@/hooks/useEVM";
import { useIsMobile } from "@/hooks/use-mobile";
import DistributionIcon from "../svgs/DistributionIcon";
import DashboardIcon from "../svgs/DashboardIcon";
import WalletIcon from "../svgs/WalletIcon";
import StreamIcon from "../svgs/StreamIcon";
import LogoutIcon from "../svgs/LogoutIcon";
import BookIcon from "../svgs/BookIcon";
import EyeIcon from "../svgs/EyeIcon";

// Desktop menu items.
const items = [
  {
    title: "Dashboard",
    url: "/",
    icon: <DashboardIcon aria-hidden="true" />,
  },
  {
    title: "Distribution",
    url: "/distribution",
    icon: <DistributionIcon aria-hidden="true" />,
  },
  {
    title: "History",
    url: "/history",
    icon: <User2 aria-hidden="true" className="text-white size-5" />,
  },
  {
    title: "Payment Stream",
    url: "/payment-stream",
    icon: <StreamIcon aria-hidden="true" />,
  },
  {
    title: "Offramp",
    url: "/offramp",
    icon: <Banknote aria-hidden="true" className="text-white size-5" />,
  },
  {
    title: "Airdrop",
    url: "/airdrop",
    icon: <EyeIcon aria-hidden="true" />,
  },
  {
    title: "Analytics",
    url: "/analytics",
    icon: <BookIcon aria-hidden="true" />,
  },
  {
    title: "Help",
    url: "/support",
    icon: <WalletIcon aria-hidden="true" />,
  },
];

// Mobile bottom navigation items.
const mobileItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: <DashboardIcon aria-hidden="true" />,
  },
  {
    title: "Offramp",
    url: "/offramp",
    icon: <Banknote aria-hidden="true" className="text-white size-5" />,
  },
  {
    title: "Distribute",
    url: "/distribution",
    icon: <DistributionIcon aria-hidden="true" />,
  },
  {
    title: "Analytics",
    url: "/analytics",
    icon: <BookIcon aria-hidden="true" />,
  },
  {
    title: "History",
    url: "/history",
    icon: <User2 aria-hidden="true" className="text-white size-5" />,
  },
];

export function AppSidebar() {
  const pathname = usePathname();
  const { disconnect, isConnected } = useEVM();
  const { setOpenMobile } = useSidebar();
  const isMobile = useIsMobile();

  // Mobile bottom navigation
  if (isMobile) {
    return (
      <div className="fixed bottom-0 left-0 right-0 bg-black border-t border-gray-800 z-50 safe-area-pb">
        <nav className="flex items-center overflow-x-auto scrollbar-hide py-1 px-2 sm:py-2 sm:px-4 gap-1">
          {mobileItems.map((item) => {
            const isActive = pathname === item.url;

            return (
              <Link
                key={item.title}
                href={item.url}
                className={`flex flex-col items-center justify-center py-1 px-3 sm:py-2 sm:px-4 min-w-[60px] flex-shrink-0 transition-colors touch-manipulation ${isActive ? "text-white" : "text-gray-400"
                  }`}
                onClick={() => setOpenMobile(false)}
              >
                <div className={`mb-0.5 sm:mb-1 ${isActive ? "text-white" : "text-gray-400"
                  }`}>
                  {item.icon}
                </div>
                <span className={`text-[10px] sm:text-xs font-medium leading-tight whitespace-nowrap ${isActive ? "text-white" : "text-gray-400"
                  }`}>
                  {item.title}
                </span>
              </Link>
            );
          })}
        </nav>
      </div>
    );
  }

  // Desktop sidebar
  return (
    <Sidebar
      className="pt-7 bg-fundable-mid-grey/10"
      aria-label="Main navigation"
    >
      <Link href="https://fundable.finance">
        <Image src={Logo} alt="Fundable Logo" priority className="pl-8 mb-12" />
      </Link>
      <div className="pr-4 pl-5 pb-16 flex-1 flex flex-col justify-between">
        <nav
          className="flex flex-col gap-y-4 pr-2"
          data-slot="sidebar-menu-wrapper"
          aria-label="Main menu"
        >
          <ul className="w-full space-y-2">
            {items.map((link) => {
              const isActive = pathname === link.url;

              return (
                <li key={link.title}>
                  <Link
                    href={link.url}
                    onClick={() => setOpenMobile(false)}
                    className={`flex items-center gap-x-2 rounded p-2  transition-colors focus:outline-none focus:ring-1 focus:ring-fundable-purple-2 focus:ring-offset-2 focus:ring-offset-black 
                    ${isActive
                        ? "bg-fundable-purple-2 text-black"
                        : "hover:ring-2 hover:ring-fundable-purple-2 text-white"
                      }`}
                    data-slot="sidebar-menu"
                    aria-current={isActive ? "page" : undefined}
                  >
                    <span
                      data-slot="sidebar-icon"
                      className="size-9 grid place-content-center rounded-full bg-black"
                      aria-hidden="true"
                    >
                      {link.icon}
                    </span>
                    <span
                      className="text-sm font-medium"
                      data-slot="sidebar-title"
                    >
                      {link.title}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {isConnected ? (
          <div
            className="text-white flex items-center gap-x-4 cursor-pointer hover:bg-fundable-purple-2 p-2 rounded hover:text-black transition-all active:bg-fundable-purple-2"
            onClick={() => {
              disconnect();
              setOpenMobile(false);
            }}
          >
            <span className="size-9 grid place-content-center rounded-full bg-black">
              <LogoutIcon />
            </span>
            <span className="font-medium">Disconnect Wallet</span>
          </div>
        ) : null}
      </div>
    </Sidebar>
  );
}
