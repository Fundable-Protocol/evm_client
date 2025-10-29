// "use client";

// import { Suspense } from "react";
// import DashboardLayout from "@/components/layouts/DashboardLayout";
// import CreatePaymentStream from "@/components/modules/payment-stream/CreatePaymentStream";
// import { StreamsHistory } from "@/components/modules/payment-stream/StreamsHistory";
// import StreamsTableSkeleton from "@/components/modules/payment-stream/StreamsTableSkeleton";

// const PaymentStream = () => {
//   return (
//     <>
//       <DashboardLayout
//         title="Create Payment Streams"
//         className="flex flex-col gap-y-6 h-full bg-transparent"
//         infoMessage={{
//           type: "warning",
//           title: "Beta Feature",
//           message: "Feature is in beta mode.",
//           showOnNetwork: "mainnet",
//         }}
//       >
//         <CreatePaymentStream />
//         <Suspense fallback={<StreamsTableSkeleton />}>
//           <StreamsHistory />
//         </Suspense>
//       </DashboardLayout>
//     </>
//   );
// };

// export default PaymentStream;

import DashboardLayout from "@/components/layouts/DashboardLayout";

const PaymentStreamPage = () => {
  return (
    <DashboardLayout
      title="Create Payment Streams"
      className="flex flex-col gap-y-6 h-full"
    ></DashboardLayout>
  );
};

export default PaymentStreamPage;