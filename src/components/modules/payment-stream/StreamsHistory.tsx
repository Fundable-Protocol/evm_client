// import { useState } from "react";
// import { useQuery, useQueryClient } from "@tanstack/react-query";
// import { useSearchParams } from "next/navigation";
// import { useAccount } from "@starknet-react/core";

// import StreamsTable from "./StreamsTable";
// import { capitalizeWord } from "@/lib/utils";
// import { paymentStreamStatus, validPageLimits } from "@/lib/constant";
// import AppSelect from "@/components/molecules/AppSelect";
// import StreamsTableSkeleton from "./StreamsTableSkeleton";
// import PaymentStreamApiService from "@/services/api/paymentStreamService";
// import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
// import { streamColumns } from "./streamColumns";
// import StreamActionsCell from "./StreamActionsCell";
// import type { ColumnDef } from "@tanstack/react-table";
// import type { StreamRecord } from "@/types/payment-stream";

// export const StreamsHistory = () => {
//   const { address } = useAccount();
//   const queryClient = useQueryClient();

//   const searchParams = useSearchParams();

//   const page = parseInt(searchParams.get("page") || "1");
//   const limit = validPageLimits.includes(
//     parseInt(
//       searchParams.get("limit") || "10"
//     ) as (typeof validPageLimits)[number]
//   )
//     ? parseInt(searchParams.get("limit") || "10")
//     : validPageLimits[0];

//   const [statusFilter, setStatusFilter] = useState("all");

//   // Check for the switch signal
//   const shouldSwitchToOutgoing = queryClient.getQueryData([
//     "stream-created-switch-tab",
//   ]);

//   // Use state for manual tab control, but initialize based on switch signal
//   const [activeTab, setActiveTab] = useState(() =>
//     shouldSwitchToOutgoing ? "outgoing" : "incoming"
//   );

//   // Update activeTab when switch signal appears
//   if (shouldSwitchToOutgoing && activeTab !== "outgoing") {
//     setActiveTab("outgoing");
//     // Clear the signal after using it
//     queryClient.removeQueries({
//       queryKey: ["stream-created-switch-tab"],
//     });
//   }

//   const tabTriggerValues = ["incoming", "outgoing"];

//   const { data: streamsData, isPending } = useQuery({
//     queryKey: ["payment-streams-table", statusFilter, page, limit, activeTab],
//     queryFn: () =>
//       PaymentStreamApiService.getStreams(address ?? "", {
//         page,
//         limit,
//         type: activeTab,
//         status: statusFilter !== "all" ? statusFilter : undefined,
//       }),
//     enabled: !!address,
//   });

//   const statusOptions = ["all", ...paymentStreamStatus].map((status) => ({
//     label: capitalizeWord(status),
//     value: status,
//   }));

//   const handleStatusChange = (value: string) => {
//     setStatusFilter(value);
//   };

//   const handleTabChange = (tab: string) => {
//     setActiveTab(tab);
//     // Clear any existing switch signal when manually changing tabs
//     queryClient.removeQueries({
//       queryKey: ["stream-created-switch-tab"],
//     });
//   };

//   return (
//     <div className="w-full mt-6 text-[#E1E4EA]">
//       <h1 className="font-syne font-medium pb-2 border-b border-b-gray-700 w-full mb-4">
//         Streams History
//       </h1>

//       <Tabs
//         value={activeTab}
//         defaultValue="incoming"
//         className="w-full"
//         onValueChange={handleTabChange}
//       >
//         <div className="flex mb-2 items-center w-full gap-x-6">
//           <TabsList className="bg-[#242838] p-1 rounded-xs h-auto">
//             {tabTriggerValues.map((value) => (
//               <TabsTrigger
//                 key={value}
//                 value={value}
//                 className="data-[state=active]:bg-[#2A2E41] hover:cursor-pointer data-[state=active]:text-[#E1E4EA] text-text-fundable-mid-grey rounded-xs"
//               >
//                 {capitalizeWord(value)}
//               </TabsTrigger>
//             ))}
//           </TabsList>

//           <AppSelect
//             placeholder={
//               statusOptions.find((opt) => opt.value === statusFilter)?.label ||
//               statusOptions[0].label
//             }
//             options={statusOptions}
//             setValue={handleStatusChange}
//             className="w-full lg:w-3xs"
//           />
//         </div>

//         {address && isPending ? (
//           <StreamsTableSkeleton />
//         ) : (
//           <>
//             <TabsContent value="incoming">
//               <StreamsTable
//                 data={streamsData?.data?.paymentStreams ?? []}
//                 page={streamsData?.data?.meta.currentPage}
//                 limit={streamsData?.data?.meta.perPage}
//                 totalCount={streamsData?.data?.meta.totalRows}
//                 columns={([
//                   ...streamColumns,
//                   {
//                     id: "actions",
//                     header: () => <div className="text-center">Action</div>,
//                     cell: ({ row }) => (
//                       <div className="flex justify-center">
//                         <StreamActionsCell stream={row.original as StreamRecord} />
//                       </div>
//                     ),
//                   },
//                 ]) as ColumnDef<StreamRecord>[]}
//               />
//             </TabsContent>

//             <TabsContent value="outgoing">
//               <StreamsTable
//                 data={streamsData?.data?.paymentStreams ?? []}
//                 page={streamsData?.data?.meta.currentPage}
//                 limit={streamsData?.data?.meta.perPage}
//                 totalCount={streamsData?.data?.meta.totalRows}
//               />
//             </TabsContent>
//           </>
//         )}
//       </Tabs>
//     </div>
//   );
// };
