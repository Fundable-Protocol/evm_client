"use client";

import DashboardLayout from "@/components/layouts/DashboardLayout";
import CreatePaymentStream from "@/components/modules/payment-stream/CreatePaymentStream";
import { StreamsHistory } from "@/components/modules/payment-stream/StreamsHistory";

const PaymentStream = () => {
  return (
    <>
      <DashboardLayout
        title="Create Payment Streams"
        className="flex flex-col gap-y-6 h-full bg-transparent"
        availableNetwork={["testnet", "mainnet"]}
        infoMessage={{
          type: "warning",
          title: "Beta Feature",
          message: "Feature is in beta mode. Use at your own risk.",
          showOnNetwork: "mainnet",
        }}
      >
        <CreatePaymentStream />
        <StreamsHistory />
      </DashboardLayout>
    </>
  );
};

export default PaymentStream;
