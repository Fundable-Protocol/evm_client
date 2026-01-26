import FundableLogo from "../../../public/svgs/fundable_logo.svg";

import MenuSvg from "../../../public/svgs/sidebar_svg/menu.svg";
import DistributeSvg from "../../../public/svgs/sidebar_svg/activity.svg";
import AnalyticSvg from "../../../public/svgs/sidebar_svg/book.svg";
import AirdropSvg from "../../../public/svgs/sidebar_svg/eye.svg";
import PaymentStreamSvg from "../../../public/svgs/sidebar_svg/trade.svg";
import HistorySvg from "../../../public/svgs/sidebar_svg/user.svg";
import HelpSvg from "../../../public/svgs/sidebar_svg/wallet-2.svg";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import Image from "next/image";
import Link from "next/link";

// Menu items.
const items = [
  {
    title: "Overview",
    url: "/dashboard",
    icon: MenuSvg,
    attribute: "dashboard",
  },
  {
    title: "Distribution",
    url: "/admin/distribute",
    icon: DistributeSvg,
    attribute: "distribute",
  },
  {
    title: "Payment Stream",
    url: "/admin/payment-stream",
    icon: PaymentStreamSvg,
    attribute: "payment-stream",
  },
  {
    title: "Airdrop",
    url: "/admin/airdrop",
    icon: AirdropSvg,
    attribute: "airdrop",
  },
  {
    title: "Offramp",
    url: "/offramp",
    icon: HelpSvg,
    attribute: "offramp",
  },
  {
    title: "Analytics",
    url: "/admin/analytics",
    icon: AnalyticSvg,
    attribute: "Analytic",
  },
  {
    title: "History",
    url: "/admin/history",
    icon: HistorySvg,
    attribute: "history",
  },
  {
    title: "Help",
    url: "/admin/help",
    icon: AnalyticSvg,
    attribute: "help",
  },
];

export function AppSidebar() {
  const { setOpenMobile } = useSidebar();

  return (
    <Sidebar>
      <SidebarContent className="bg-[#151617] px-6">
        <SidebarGroup>
          <SidebarGroupLabel className="my-6 pr-">
            <Image
              src={FundableLogo}
              alt="logo"
              className="w-28 md:w-24 z-10"
              priority
            />
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="mt-6">
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    className="py-6 hover:bg-fundable-violet"
                    onClick={() => setOpenMobile(false)}
                  >
                    <Link
                      href={item.url}
                      className="text-white hover:text-white focus:text-black"
                    >
                      <Image src={item.icon} alt={item.attribute} priority />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
