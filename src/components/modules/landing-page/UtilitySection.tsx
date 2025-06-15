import EfficientSvg from "../../../../public/svgs/efficient.svg";
import UtilitySvg from "../../../../public/svgs/UtilityImg.svg";
import NoLimitSvg from "../../../../public/svgs/no-limits.svg";
import SecureSvg from "../../../../public/svgs/secure.svg";
import SpherSvg from "../../../../public/svgs/sphere.svg";

import Image from "next/image";
import UtilityCard, { UtilityDivProps } from "./UtilityCard";

const UtilitySection = () => {
  const utilities = [
    {
      title: "Efficient",
      description:
        "Streamline your funding workflows, reduce administrative overhead, and allocate more resources to driving impact and growth.",
      image: EfficientSvg,
      color: "efficient",
    },
    {
      title: "Secure & Insured",
      description:
        "Ensure transparent and secure funding distributions, building trust with your community and providing a clear audit trail for all transactions.",
      image: SecureSvg,
      color: "secure",
    },
    {
      title: "No Limits",
      description:
        "Unlock limitless funding potential with Fundable's scalable and adaptable platform, empowering you to drive innovation and growth without boundaries.",
      image: NoLimitSvg,
      color: "nolimits",
    },
  ];

  return (
    <section className="container mx-auto space-y-12 mt-24 relative">
      <div className="flex flex-col items-center lg:flex-row justify-between gap-y-4 lg:gap-y-0">
        <h1 className="font-syne text-3xl text-center sm:text-left lg:text-6xl font-bold">
          Send payments in <br className="hidden lg:inline-block" />
          crypto currencies
        </h1>
        <p className="text-center lg:text-right text-sm md:text-lg tracking-wider md:leading-[1.875rem] lg:w-1/2">
          Unlock the full potential of decentralized funding with
          Fundable&apos;s <br className="hidden lg:inline-block" /> efficient,
          transparent, and community-driven solutions.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 justify-between items-center">
        <Image
          src={UtilitySvg}
          alt="utilities image"
          className="object-cover"
        />

        <div className="flex flex-col gap-y-8 lg:w-1/2">
          {utilities.map((utilityInfo) => (
            <UtilityCard
              {...utilityInfo}
              color={utilityInfo.color as UtilityDivProps["color"]}
              key={utilityInfo.title}
            />
          ))}
        </div>
      </div>

      <Image
        src={SpherSvg}
        alt="sphere image"
        className="object-cover -ml-24 -mt-8 hidden lg:block"
      />
    </section>
  );
};

export default UtilitySection;
