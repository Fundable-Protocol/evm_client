import RetroSvg from "../../../../public/svgs/retro.svg";
import QuadraticSvg from "../../../../public/svgs/quadratic.svg";
import SolarImg from "../../../../public/imgs/solar.png";

import FeatureCard from "./FeatureCard";
import Image from "next/image";

const FeatureSection = () => {
  const retroData = {
    title: "Token Distributions",
    description:
      "Efficiently distribute tokens to multiple recipients in one transaction. Support for both equal and weighted distributions, with transparent fee structures and real-time transaction tracking.",
    link: "#",
    imageSrc: RetroSvg,
    imageAlt: "Token distribution illustration",
  };

  const streaming = {
    title: "Streaming",
    description:
      "Automate continuous crypto payouts—subscriptions, salaries, and more—so you can focus on growth, not transfers.",
    link: "#",
  };

  const crowdfunding = {
    title: "Emergency Crowdfunding",
    description: 
      "When every second counts, our platform enables rapid fundraising for critical medical expenses and life-threatening emergencies. Connect with compassionate donors ready to help save lives and make a real difference.",
    link: "#",
    imageSrc: SolarImg,
    imageAlt: "Emergency crowdfunding illustration",
  };

  const airdrop = {
    title: "AirDrops",
    description:
      "Seamlessly distribute tokens to your community with our gas-optimized airdrop tool. Supports customizable distribution rules, and automated eligibility verification—making token distribution campaigns efficient and cost-effective.",
    link: "#",
  };

  return (
    <section className="container mx-auto space-y-12 relative">
      <div className="flex flex-col items-center lg:flex-row justify-between gap-y-4 lg:gap-y-0">
        <h1 className="font-syne text-3xl text-center sm:text-left lg:text-6xl font-bold">
          Decentralized <br className="hidden lg:inline-block" />
          Funding Made Easy
        </h1>
        <p className="text-center lg:text-right text-sm md:text-lg tracking-wider lg:leading-[1.875rem]">
        Fundable simplifies crypto-native funding: 
          <br className="hidden lg:inline-block" />mass token distributions, payment streaming,<br className="hidden lg:inline-block" />
          crowdfunding, and airdrop payouts, all automated and gas-efficient.
        </p>
      </div>
      <div className="space-y-6">
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Retroactive Funding */}
          <FeatureCard {...retroData} />

          {/* Quadratic Funding */}
          <FeatureCard {...streaming} />

        </div>

        <div className="grid lg:grid-cols-[0.7fr_0.3fr] gap-6">
          {/* Streaming */}

          <FeatureCard {...crowdfunding} />

          {/* Airdrop */}

          <FeatureCard {...airdrop} />
        </div>
      </div>

      <Image
        src={SolarImg}
        alt="solar image"
        className="absolute -bottom-[36%] -right-20 hidden lg:block"
        priority
      />
    </section>
  );
};

export default FeatureSection;
