import Image from "next/image";

import FaqAccordion from "./FaqAccordionSection";
import blur from "../../../../public/svgs/blur.svg";
import star from "../../../../public/svgs/star.svg";

const FaqSection = () => {
  return (
    <section className="container mx-auto lg:-mt-36 relative">
      <Image
        src={blur}
        alt="blur"
        className="absolute object-cover w-[80%] h-auto -top-[90%] right-[15%]"
      />
      <div className="flex flex-col items-center gap-y-4">
        <h1 className="font-syne text-2xl md:text-3xl text-center sm:text-left lg:text-5xl font-bold">
          Frequently Asked Questions
        </h1>
        <p className="text-center text-sm md:text-lg tracking-wide lg:leading-[1.875rem] text-fundable-white text-balance">
          Get the answers you need to navigate our platform with confidence.
        </p>
      </div>

      <FaqAccordion />

      <Image
        src={star}
        alt="faq-star"
        className="hidden xl:inline-block absolute object-cover w-[27%] h-auto -bottom-[40%] right-[20%] -z-10"
      />
    </section>
  );
};

export default FaqSection;
