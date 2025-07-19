"use client";

import DashboardLayout from "@/components/layouts/DashboardLayout";
import CreatePaymentStream from "@/components/modules/payment-stream/CreatePaymentStream";

const PaymentStream = () => {
  return (
    <DashboardLayout
      title="Create Stream"
      className="flex flex-col gap-y-6 h-full"
    >
      <CreatePaymentStream />
    </DashboardLayout>
  );
};

export default PaymentStream;
