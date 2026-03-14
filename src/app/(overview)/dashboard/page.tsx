"use client";

import Image from "next/image";

import Abstract1 from "../../../../public/svgs/abstract1.svg";
import Abstract2 from "../../../../public/svgs/abstract2.svg";
import Abstract3 from "../../../../public/svgs/abstract3.svg";

import FeatureCards from "@/components/modules/dashboard/FeatureCards";
import DashboardChart from "@/components/modules/dashboard/DashboardChart";
import TransactionCards from "@/components/modules/dashboard/TransactionCards";

const DashboardPage = () => {
  
  return (
    <main className="h-full overflow-y-auto space-y-4 md:space-y-12">
      <TransactionCards />
      <FeatureCards />
      <DashboardChart />
      <Image
        priority
        src={Abstract1}
        alt="AbstractImage1"
        className="absolute top-[21%] left-[31.5%] -z-10 hidden lg:inline-block"
      />
      <Image
        priority
        src={Abstract2}
        alt="AbstractImage2"
        className="absolute -bottom-10 right-0 -z-10 hidden lg:inline-block"
      />
      <Image
        priority
        src={Abstract3}
        alt="AbstractImage3"
        className="absolute bottom-0 left-[3%] -z-10 hidden lg:inline-block"
      />
    </main>
  );
};

export default DashboardPage;
