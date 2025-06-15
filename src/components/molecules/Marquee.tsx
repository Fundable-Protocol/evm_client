"use client";

import { motion } from "motion/react";

import Image from "next/image";

import IconOkk from "../../../public/imgs/marqueLogos/okxLogo.png";
import IconArgent from "../../../public/imgs/marqueLogos/argentX.png";
import IconBravaas from "../../../public/imgs/marqueLogos/bravoos.png";
import IconStarknet from "../../../public/imgs/marqueLogos/starknet.png";
import IconMetamask from "../../../public/imgs/marqueLogos/metamask.png";

const Marquee = () => {
  const logos = [
    {
      image: IconArgent,
      alt: "argent-logo",
    },
    {
      image: IconStarknet,
      alt: "starknet-logo",
    },
    {
      image: IconMetamask,
      alt: "metamask-logo",
    },
    {
      image: IconBravaas,
      alt: "bravaas-logo",
    },
    {
      image: IconOkk,
      alt: "okk-logo",
    },
  ];

  return (
    <div className="flex overflow-hidden py-8 md:-mt-28">
      {Array.from({ length: 3 }).map((_, index) => (
        <motion.div
          key={index}
          initial={{ x: 0 }}
          animate={{ x: "-100%" }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          className="flex flex-shrink-0 justify-center items-center"
        >
          {logos.map((logo) => (
            <Image
              src={logo.image}
              alt={logo.alt}
              key={logo.alt}
              className="mx-8  md:mx-12 w-28 md:w-32"
              priority
            />
          ))}
        </motion.div>
      ))}
    </div>
  );
};

export default Marquee;
