import Image, { StaticImageData } from "next/image";

import { cn } from "@/lib/utills";

export interface UtilityDivProps {
  title: string;
  description: string;
  image: StaticImageData;
  color: "efficient" | "secure" | "nolimits";
}

function UtilityCard({ title, description, image, color }: UtilityDivProps) {
  const titleColorClass = {
    efficient: "text-[#2CBCA5]",
    secure: "text-[#50ADD7]",
    nolimits: "text-[#C742F7]",
  };

  return (
    <div className="flex items-start gap-6 bg-[#1A1C2C] rounded-lg p-6">
      <Image src={image} alt={title} className="object-cover" />

      <div className="flex flex-col gap-2 font-urbanist font-semibold">
        <p className={cn("text-lg lg:text-xl", titleColorClass[color])}>
          {title}
        </p>
        <p className="text-[#B7B4CB]">{description}</p>
      </div>
    </div>
  );
}

export default UtilityCard;
