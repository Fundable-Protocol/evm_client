"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useAccount } from "@starknet-react/core";

import { User2 } from "lucide-react";
import { Sidebar, useSidebar } from "@/components/ui/sidebar";
import Logo from "../../../public/svgs/fundable_logo.svg";

import { useConnectWallet } from "@/hooks/useConnectWallet";
import DistributionIcon from "../svgs/DistributionIcon";
import DashboardIcon from "../svgs/DashboardIcon";
import WalletIcon from "../svgs/WalletIcon";
import StreamIcon from "../svgs/StreamIcon";
import LogoutIcon from "../svgs/LogoutIcon";
import BookIcon from "../svgs/BookIcon";
import EyeIcon from "../svgs/EyeIcon";

// Menu items.
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

export function AppSidebar() {
  const pathname = usePathname();
  const { disConnectWallet } = useConnectWallet();
  const { setOpenMobile } = useSidebar();

  const { address } = useAccount();

  const handleLinkClick = () => {
    setOpenMobile(false);
  };

  return (
    <Sidebar
      className="pt-7 bg-fundable-mid-grey/10"
      aria-label="Main navigation"
    >
      <Link href="/">
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
                    onClick={handleLinkClick}
                    className={`flex items-center gap-x-2 rounded p-2  transition-colors focus:outline-none focus:ring-1 focus:ring-fundable-purple-2 focus:ring-offset-2 focus:ring-offset-black 
                    ${
                      isActive
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

        {address ? (
          <div
            className="text-white flex items-center gap-x-4 cursor-pointer hover:bg-fundable-purple-2 p-2 rounded hover:text-black transition-all active:bg-fundable-purple-2"
            onClick={() => {
              disConnectWallet();
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
