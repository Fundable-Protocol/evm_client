"use client";

import DashboardLayout from "@/components/layouts/DashboardLayout";
import { StreamsHistory } from "@/components/modules/payment-stream/StreamsHistory";

const PaymentStream = () => {
  return (
    <>
      <DashboardLayout
        title="My Payment Streams"
        className="flex flex-col gap-y-6 h-full bg-transparent"
        availableNetwork={["testnet"]}
      >
        <StreamsHistory />
        </DashboardLayout>
    </>  
  );
};

export default PaymentStream;
