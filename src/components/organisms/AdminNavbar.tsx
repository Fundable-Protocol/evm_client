"use client";

import { usePathname } from "next/navigation";
import Image from "next/image";

import ConnectButton from "@/components/atoms/ConnectButton";
import AvaTar from "../../../public/svgs/avatar.svg";
import { SidebarTrigger } from "@/components/ui/sidebar";
import NotificationIcon from "@/components/svgs/NotificationIcon";

import { sliceAddress } from "@/lib/utils";
import { useMount } from "@/hooks/useMount";
import SkeletonNavbar from "@/components/organisms/NavbarLoader";
// import NetworkIndicator from "@/components/molecules/NetworkIndicator";

import { useEVM } from "@/hooks/useEVM";

const AdminNavbar = () => {
  const isMounted = useMount();
  const pathname = usePathname();
  const { isConnected, address } = useEVM();

  const currentPath = pathname?.slice(1);

  const connectAddress = address
    ? sliceAddress(address as string)
    : "Connecting";

  if (!isMounted) {
    return <SkeletonNavbar />;
  }

  return (
    <nav className="py-3 px-3 md:px-5 flex justify-between items-center border-b border-b-fundable-mid-dark text-white">
      <span className="flex items-center gap-x-2">
        <SidebarTrigger />
        <h2 className="hidden lg:block font-medium md:text-2xl font-bricolage capitalize">
          {currentPath}
        </h2>
      </span>
      <div className="flex items-center gap-x-4">
        {/* <NetworkIndicator isConnected={isConnected} /> */}
        <span className="size-12 hidden md:grid place-content-center rounded-full bg-fundable-mid-dark">
          <NotificationIcon />
        </span>

        {/* Chain Switch Button */}
        {isConnected && <appkit-network-button />}

        {isConnected ? (
          <div className="bg-gradient-to-r from-blue-500 via-purple-800 to-pink-500 rounded-sm px-2 md:px-3 py-1 md:py-2 text-sm font-medium flex gap-x-2 font-bricolage">
            <Image
              src={AvaTar}
              alt="Avatar"
              width={50}
              height={50}
              className="w-auto"
              priority
            />
            {connectAddress}
          </div>
        ) : (
          <ConnectButton />
        )}
      </div>
    </nav>
  );
};

export default AdminNavbar;
