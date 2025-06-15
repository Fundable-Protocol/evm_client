"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";

import { StaticImport } from "next/dist/shared/lib/get-img-props";
import carouselImage from "../../../../public/svgs/carousel_thumbail.svg";

import { Card, CardContent, CardDescription } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export interface BlogCarouselProps {
  setApi: (api: CarouselApi) => void;
  cardDetails: {
    heading: string;
    description: string;
    Image: StaticImport;
    link: string;
  }[];
}
// md:min-w-[18rem]
const BlogCarousel = ({ setApi, cardDetails }: BlogCarouselProps) => {
  return (
    <Carousel
      setApi={setApi}
      opts={{
        align: "start",
      }}
    >
      <CarouselContent className="w-full">
        {cardDetails.map((cardDetail, index) => (
          <CarouselItem
            key={index}
            className="basis-1/1 md:basis-1/2 lg:basis-1/3 md:max-w-[25rem]"
          >
            <Card className="p-1.5 pb-6 bg-black border-[#1E212F]">
              <CardContent className="p-0">
                <Image
                  src={cardDetail.Image}
                  alt="image"
                  className="w-full h-auto object-contain rounded-lg"
                />

                <CardDescription className="mt-8 space-y-4">
                  <h1 className="text-base font-medium text-white">
                    {cardDetail.heading}
                  </h1>
                  <p className="text-[#A5AEC0] text-balance font-medium">
                    {cardDetail.description}
                  </p>
                  <Link
                    href={cardDetail.link}
                    className="flex items-center gap-x-1"
                  >
                    <span className="text-base font-medium">Read more</span>
                    <ArrowRight size="1rem" />
                  </Link>
                </CardDescription>
              </CardContent>
            </Card>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
};

const BlogCarouselWrapper = ({ setApi }: Pick<BlogCarouselProps, "setApi">) => {
  const cardDetails = [
    {
      heading: "Talk it out with audio",
      description:
        "Effortlessly distribute funds to recipients, with complete transparency, robust security, and real-time tracking.",
      Image: carouselImage,
      link: "link",
    },
    {
      heading: "Talk it out with audio",
      description:
        "Effortlessly distribute funds to recipients, with complete transparency, robust security, and real-time tracking.",
      Image: carouselImage,
      link: "link",
    },
    {
      heading: "Talk it out with audio",
      description:
        "Effortlessly distribute funds to recipients, with complete transparency, robust security, and real-time tracking.",
      Image: carouselImage,
      link: "link",
    },
    {
      heading: "Talk it out with audio",
      description:
        "Effortlessly distribute funds to recipients, with complete transparency, robust security, and real-time tracking.",
      Image: carouselImage,
      link: "link",
    },
    {
      heading: "Talk it out with audio",
      description:
        "Effortlessly distribute funds to recipients, with complete transparency, robust security, and real-time tracking.",
      Image: carouselImage,
      link: "link",
    },
  ];

  return <BlogCarousel setApi={setApi} cardDetails={cardDetails} />;
};

export default BlogCarouselWrapper;
