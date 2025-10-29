// "use client";

// import { sliceAddress } from "@/lib/utils";
// import { format, parseISO } from "date-fns";
// import { ColumnDef } from "@tanstack/react-table";
// import { StreamRecord } from "@/types/payment-stream";

// const getStatusColor = (status: string) => {
//   switch (status?.toLowerCase()) {
//     case "active":
//       return "bg-green-500";
//     case "canceled":
//       return "bg-red-500";
//     case "transfered":
//       return "bg-blue-500";
//     case "paused":
//       return "bg-orange-500";
//     case "completed":
//       return "bg-gray-500";
//     default:
//       return "bg-gray-500";
//   }
// };

// export const streamColumns: ColumnDef<StreamRecord>[] = [
//   {
//     accessorKey: "sn",
//     header: () => <div className="text-center">S/N</div>,
//     cell: ({ row }) => (
//       <div className="text-white font-mono text-center">
//         {row.getValue("sn")}
//       </div>
//     ),
//   },
//   {
//     accessorKey: "creator",
//     header: () => <div className="text-center">Sender</div>,
//     cell: ({ row }) => (
//       <div className="text-white font-mono text-center">
//         {sliceAddress(row.getValue("creator"))}
//       </div>
//     ),
//   },
//   {
//     accessorKey: "recipient",
//     header: () => <div className="text-center">Receiver</div>,
//     cell: ({ row }) => (
//       <div className="text-white font-mono text-center">
//         {sliceAddress(row.getValue("recipient"))}
//       </div>
//     ),
//   },
//   {
//     accessorKey: "total_usd_amount",
//     header: () => <div className="text-center">Amount (USD)</div>,
//     cell: ({ row }) => (
//       <div className="text-center">
//         <span className="text-white font-mono">
//           {row.getValue("total_usd_amount")}
//         </span>
//       </div>
//     ),
//   },
//   {
//     accessorKey: "created_at",
//     header: () => <div className="text-center">Start Date</div>,
//     cell: ({ row }) => {
//       const createdAt = row.getValue("created_at") as string;
//       const formattedDate = format(
//         parseISO(createdAt),
//         "MMM dd, yyyy  hh:mm a"
//       );
//       return (
//         <div className="text-white font-mono text-center">{formattedDate}</div>
//       );
//     },
//   },
//   {
//     accessorKey: "endDate",
//     header: () => <div className="text-center">End Date</div>,
//     cell: ({ row }) => {
//       // Backend returns duration in HOURS; convert hours → milliseconds for Date math
//       const durationHours = row?.original?.duration as number;
//       const durationMs = durationHours * 60 * 60 * 1000;
//       const createdAt = new Date(row?.original?.created_at)?.getTime();
//       const endDate = new Date(createdAt + durationMs);

//       const formattedEndDate = format(endDate, "MMM dd, yyyy  hh:mm a");

//       return (
//         <div className="text-white font-mono text-center">
//           {formattedEndDate}
//         </div>
//       );
//     },
//   },
//   {
//     accessorKey: "chain_name",
//     header: () => <div className="text-center">Chain</div>,
//     cell: ({ row }) => {
//       const chain = row.getValue("chain_name") as string;
//       return <div className="text-white text-center">{chain}</div>;
//     },
//   },
//   {
//     accessorKey: "token_symbol",
//     header: () => <div className="text-center">Token</div>,
//     cell: ({ row }) => {
//       const token = row.getValue("token_symbol") as string;
//       return <div className="text-white text-center">{token}</div>;
//     },
//   },
//   {
//     accessorKey: "status",
//     header: () => <div className="text-center">Status</div>,
//     cell: ({ row }) => {
//       // Backend returns duration in HOURS; convert hours → milliseconds for comparison
//       const durationHours = row?.original?.duration as number;
//       const durationMs = durationHours * 60 * 60 * 1000;
//       const createdAt = new Date(row?.original?.created_at)?.getTime();
//       const endDate = new Date(createdAt + durationMs).getTime();

//       const currentTime = Date.now();

//       const status =
//         currentTime > endDate
//           ? "completed"
//           : (row.getValue("status") as string);

//       return (
//         <div className="flex justify-center items-center">
//           <span
//             className={`size-2 rounded-full ${getStatusColor(status)} mr-2`}
//           />
//           <div className="text-white capitalize">{status}</div>
//         </div>
//       );
//     },
//   },
// ];
