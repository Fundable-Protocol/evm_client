"use client";

import { type CarouselApi } from "@/components/ui/carousel";

import { CircleChevronLeft, CircleChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import BlogCarouselWrapper from "./BlogCarouselWrapper";
import { cn } from "@/lib/utills";

const BlogSection = () => {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  const carouselLength = api?.scrollSnapList().length;

  useEffect(() => {
    if (!api) return;

    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  const handlePrev = () => {
    if (current === 1) return;
    api?.scrollPrev();
  };

  const handleNext = () => {
    if (current === carouselLength) return;
    api?.scrollNext();
  };

  return (
    <section className="container mx-auto relative">
      <div className="flex items-center justify-between mb-10">
        <h1 className="font-syne text-2xl md:text-3xl lg:text-5xl font-bold">
          Read From <br />
          Our Blog
        </h1>
        <span className="flex gap-x-1 text-fundable-white">
          <CircleChevronLeft
            size="3rem"
            className={cn(
              "cursor-pointer",
              current === 1 ? "text-fundable-grey" : ""
            )}
            onClick={handlePrev}
          />
          <CircleChevronRight
            size="3rem"
            className={cn(
              "cursor-pointer",
              current === carouselLength ? "text-fundable-grey" : ""
            )}
            onClick={handleNext}
          />
        </span>
      </div>

      <BlogCarouselWrapper setApi={setApi} />

      {/* <Image
        src={star}
        alt="star"
        className="absolute object-cover w-[27%] h-auto -bottom-[40%] right-[20%] -z-10"
      /> */}
    </section>
  );
};

export default BlogSection;
