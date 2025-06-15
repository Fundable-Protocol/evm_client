"use client";

import Link from "next/link";
import Image from "next/image";

import { useRouter } from "next/navigation";

import FundableLogo from "../../../public/svgs/fundable_logo.svg";

import useMenuAnimation from "../../hooks/useAnimationHook";
import GradientButton from "../atoms/GradientButton";
import MenuButton from "../atoms/MenuButton";
import { isMobileDevice } from "@/lib/utills";

const links = [
  { name: "Blog", href: "#" },
  { name: "About", href: "#" },
  { name: "Contact", href: "#" },
];

const Navbar = () => {
  const router = useRouter();

  const { toggleMenu, navScope, topLineScope, bottomLineScope } =
    useMenuAnimation();

  const routeToAdmin = () => {
    router.push("/dashboard");

    if (isMobileDevice()) toggleMenu();
  };

  return (
    <nav className="container">
      <div className="flex justify-between items-center container !max-w-full  py-2 font-geist-sans border-b border-fundable-dark">
        <Image
          src={FundableLogo}
          alt="logo"
          className="w-28 md:w-24 z-20"
          priority
        />

        <div className="flex items-center z-20">
          <MenuButton
            onClick={toggleMenu}
            topLineRef={topLineScope}
            bottomLineRef={bottomLineScope}
          />

          <div className="hidden md:inline-flex">
            <GradientButton type="desktop" onClick={routeToAdmin} />
          </div>
        </div>
      </div>

      {/* Mobile Nav*/}

      <div
        className="fixed top-0 left-0 w-full h-0 overflow-hidden bg-black md:hidden z-10"
        ref={navScope}
      >
        <div className="pt-28 pb-5 container !max-w-full">
          <GradientButton onClick={routeToAdmin} />
        </div>

        <div className="flex flex-col text-white">
          {links.map((link) => (
            <Link
              href={link.href}
              key={link.name}
              className="hover:text-fundable-deep-purple-lighter text-2xl py-6 container !max-w-full border-t last:border-b border-stone-800"
              onClick={toggleMenu}
            >
              {link.name}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
