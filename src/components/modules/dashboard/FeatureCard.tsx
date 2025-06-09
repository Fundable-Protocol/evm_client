import Image from "next/image";

import { FeatureCardProps } from "@/types/dashboard";

import ArrowsIcon from "@/components/svgs/ArrowsIcon";
import ArrowRightIcon from "@/components/svgs/ArrowRight";

import StreamImg from "../../../../public/svgs/stream.svg";
import AirDropImg from "../../../../public/svgs/airdrop.svg";

import FeatureGradient from "../../../../public/svgs/feature-card-gradient.svg";
import FeatureGradient2 from "../../../../public/svgs/feature-card-gradient-2.svg";

const FeatureCard = ({
  title,
  imgType,
  linkText,
  description,
}: FeatureCardProps) => {
  return (
    <div className="grid grid-rows-[1fr_2fr_1.5fr] p-5 lg:py-6 bg-[#14161f8e] border border-[#1E212F] rounded-lg backdrop-blur relative overflow-hidden lg:min-h-[17rem]">
      <div className="flex items-start justify-between">
        <h2 className="text-xl font-semibold text-white font-geist-sans">
          {title}
        </h2>
        <ArrowsIcon />
      </div>
      <p className="text-base lg:text-balance tracking-wide leading-7 text-gray-300 font-bricolage">
        {description}
      </p>
      <div className="flex items-center gap-x-2">
        <span className="text-[#E1E4EA] font-semibold">{linkText}</span>
        <ArrowRightIcon />
      </div>

      <Image
        priority
        src={FeatureGradient}
        alt="feature-gradient"
        className="absolute -top-35 -right-30"
      />

      <Image
        priority
        src={FeatureGradient2}
        alt="feature-gradient-2"
        className="absolute -bottom-25 -left-15"
      />

      {imgType === "airdrop" ? (
        <Image
          priority
          src={AirDropImg}
          alt="airdrop-img"
          className="absolute bottom-0 -right-4 hidden lg:inline-block"
        />
      ) : (
        <Image
          priority
          src={StreamImg}
          alt="stream-img"
          className="absolute bottom-0 -right-4 hidden lg:inline-block"
        />
      )}
    </div>
  );
};

export default FeatureCard;
