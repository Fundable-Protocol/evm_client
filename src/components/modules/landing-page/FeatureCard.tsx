import Link from "next/link";
import Image, { StaticImageData } from "next/image";

import TopShadeSvg from "../../../../public/svgs/topShade.svg";
import LeftShadeSvg from "../../../../public/svgs/leftShade.svg";
import RightArrowSvg from "../../../../public/svgs/rightArrowFu.svg";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utills";

interface FeatureCardProps {
  title: string;
  description: string;
  imageAlt?: string;
  imageSrc?: StaticImageData;
  link?: string;
}

const FeatureCard = ({
  title = "",
  description = "",
  imageAlt = "",
  imageSrc,
  link = "#",
}: FeatureCardProps) => {
  const hasNoImg = !imageSrc && !imageAlt;

  return (
    <Card className="bg-dark border-gray-800 text-white relative bg-[#14161f47]">
      <CardContent className="pb-0 pr-8">
        <div className="grid gap-y-6">
          <h2 className="text-xl font-semibold">{title}</h2>
          <p
            className={cn(
              "font-medium md:text-xl text-[#A5AEC0] leading-relaxed font-urbanist",
              hasNoImg ? "text-balance" : "max-w-xl"
            )}
          >
            {description}
          </p>

          {/* READ MORE AND IMAGE SECTION */}
          <div
            className={cn(
              "flex justify-between items-start",
              hasNoImg ? "min-h-12" : "min-h-40"
            )}
          >
            <Link
              href={link}
              className="inline-flex items-end font-urbanist gap-x-1 font-semibold z-10 hover:text-fundable-purple"
            >
              Read more
              <Image
                src={RightArrowSvg}
                alt="right arrow"
                className="mb-0.5"
                priority
              />
            </Link>

            {imageSrc ? (
              <Image
                src={imageSrc}
                alt={imageAlt}
                className="absolute bottom-0 right-0 object-cover w-3xs md:w-xs rounded-lg"
                priority
              />
            ) : null}
          </div>
        </div>
      </CardContent>
      <Image
        src={TopShadeSvg}
        alt="circular top shade image"
        className="absolute top-0 left-[5%]"
        width={480}
        height={138}
        priority
      />
      <Image
        src={LeftShadeSvg}
        alt="circular left shade image"
        className="absolute bottom-0 left-0"
        width={104}
        height={50}
        priority
      />
    </Card>
  );
};

export default FeatureCard;
