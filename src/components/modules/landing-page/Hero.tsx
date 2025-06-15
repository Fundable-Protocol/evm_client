import Image from "next/image";

import Marquee from "@/components/molecules/Marquee";

import FundableHero from "../../../../public/svgs/fundableHero.svg";
import { TextHoverEffect } from "@/components/ui/text-hover-effect";
import { ContainerTextFlip } from "@/components/ui/container-text-flip";

const Hero = () => {
  const words = ["Grants", "Salaries", "Airdrops", "Subscriptions", "More..."];

  return (
    <header className="text-center container">
      <div className="hidden md:inline-block h-[4rem]">
        <TextHoverEffect text="FUNDABLE" />
      </div>

      <h1 className="font-syne text-3xl md:leading-[6rem] md:text-8xl font-bold">
        Refining Automated <br /> Payments in Web3
      </h1>
      <div className="mt-4 md:flex md:items-center md:justify-center md:gap-x-2">
        <p className="font-inter md:text-xl tracking-wide mb-2 md:mb-0">
          Your one stop web3 <br className="md:hidden" />
          automated payment solution for
        </p>
        {/* <br className="inline md:hidden" /> */}
        <ContainerTextFlip words={words} />
      </div>
      <div className="flex flex-col justify-center items-center relative mt-8">
        {/* <div className="absolute space-x-4 md:space-x-8 md:top-40">
          <Link href="#" className="z-10">
            <Button
              className="bg-fundable-deep-purple hover:bg-fundable-purple"
              size="md"
            >
              Get Started
            </Button>
          </Link>

          <Link href="#" className="z-10">
            <Button
              variant="secondary"
              size="md"
              className="bg-fundable-dark hover:text-black hover:border-black text-white dark:hover:bg-white dark:hover:border-none"
            >
              Discover More
            </Button>
          </Link>
        </div> */}

        <Image src={FundableHero} alt="Fundable hero image" priority />

        <div className="absolute  bg-black dark:bg-black hidden md:block h:8 md:h-32 w-full bottom-0" />
      </div>

      <Marquee />
    </header>
  );
};

export default Hero;
