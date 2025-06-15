import RetroSvg from "../../../../public/svgs/retro.svg";
import QuadraticSvg from "../../../../public/svgs/quadratic.svg";
import SolarImg from "../../../../public/imgs/solar.png";

import FeatureCard from "./FeatureCard";
import Image from "next/image";

const FeatureSection = () => {
  const retroData = {
    title: "Retroactive Funding",
    description:
      "Description: Reward contributors for their past work and achievements, fostering a sense of appreciation and motivating continued contributions.",
    link: "#",
    imageSrc: RetroSvg,
    imageAlt: "Retroactive funding illustration",
  };

  const quaDraticFund = {
    title: "Quadratic Funding",
    description:
      "Amplify the impact of small contributions, create a more inclusive funding model, and ensure that every voice is heard.",
    link: "#",
    imageSrc: QuadraticSvg,
    imageAlt: "Quadratic funding illustration",
  };

  const streaming = {
    title: "Streaming",
    description:
      "Streamline your payment workflows with automated solutions for recurring payments, salaries, subscriptions, and more, reducing administrative burdens and minimizing errors.",
    link: "#",
  };

  const airdrop = {
    title: "AirDrops",
    description:
      "Effortlessly distribute funds to recipients, with complete transparency, robust security, and real-time tracking.",
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
          Fundable: Decentralized funding for retroactive, quadratic,
          <br className="hidden lg:inline-block" /> and giveaway distributions,
          streamlining complex <br className="hidden lg:inline-block" />
          payments.
        </p>
      </div>
      <div className="space-y-6">
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Retroactive Funding */}
          <FeatureCard {...retroData} />

          {/* Quadratic Funding */}

          <FeatureCard {...quaDraticFund} />
        </div>

        <div className="grid lg:grid-cols-[0.7fr_0.3fr] gap-6">
          {/* Streaming */}

          <FeatureCard {...streaming} />

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
