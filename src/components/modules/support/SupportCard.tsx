"use client";

import React from "react";
import { cn } from "@/lib/utills";
import { Button } from "@/components/ui/button";

interface SupportCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  buttonText: string;
  contactInfo?: string;
  handleOnClick?: () => void;
}

const SupportCard: React.FC<SupportCardProps> = ({
  icon,
  title,
  description,
  buttonText,
  contactInfo,

  handleOnClick,
}) => {
  return (
    <div
      className={cn(
        "bg-fundable-mid-grey/10   border-[0.5px] outline-0 rounded-[12px] p-6  flex flex-col items-center text-center  w-full min-h-[330px]  justify-center",
        "transition-all duration-300 hover:border-fundable-purple-2/50  hover:shadow-fundable-purple-2/10"
      )}
    >
      <div className="flex flex-col items-center justify-center lg:max-w-[330px] px-8 ">
        <div className="mb-4">
          <div
            className={cn(
              "w-14 h-14 rounded-full flex items-center justify-center bg-[#3E3E3EE5] "
            )}
          >
            {icon}
          </div>
        </div>

        <h3 className="text-fundable-faint-white text-xl font-urbanist font-semibold">
          {title}
        </h3>

        <p className="text-fundable-light-grey text-base font-semibold my-[13px] font-urbanist ">
          {description}
        </p>

        <Button
          className=" w-full bg-fundable-purple-2 text-black font-semibold rounded-[5px] hover:bg-fundable-purple-2/80 "
          onClick={handleOnClick}
        >
          {buttonText}
        </Button>

        <p className="py-4 text-fundable-light-grey text-sm font-urbanist">
          {contactInfo}
        </p>
      </div>
    </div>
  );
};

export default SupportCard;
