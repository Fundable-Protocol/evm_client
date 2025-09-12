import { useEffect, useState } from "react";
import { Stream } from "@/types/payment-stream";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import StreamsTable from "./StreamsTable";
import StreamsTableSkeleton from "./StreamsTableSkeleton";

export const StreamsHistory = () => {
  const [activeTab, setActiveTab] = useState("incoming");
  const [incomingStatusFilter, setIncomingStatusFilter] = useState("all");
  const [outgoingStatusFilter, setOutgoingStatusFilter] = useState("all");

  const incomingStreams: Stream[] = [
    {
      id: 1,
      recipient: "0x0780.....93C",
      amountPerSecond: 10,
      startDate: "12th Feb 2025",
      endDate: "12th Mar 2025",
      token: "XLM",
      status: "Active",
    },
    {
      id: 2,
      recipient: "0x0780.....93C",
      amountPerSecond: 20,
      startDate: "12th Feb 2025",
      endDate: "12th Mar 2025",
      token: "TON",
      status: "Paused",
    },
    {
      id: 3,
      recipient: "0x0780.....93C",
      amountPerSecond: 30,
      startDate: "12th Feb 2025",
      endDate: "12th Mar 2025",
      token: "STRK",
      status: "Completed",
    },
  ];

  const outgoingStreams: Stream[] = [
    {
      id: 1,
      recipient: "0x0780.....93C",
      amountPerSecond: 10,
      startDate: "12th Feb 2025",
      endDate: "12th Mar 2025",
      token: "XLM",
      status: "Active",
    },
    {
      id: 2,
      recipient: "0x0780.....93C",
      amountPerSecond: 20,
      startDate: "12th Feb 2025",
      endDate: "12th Mar 2025",
      token: "TON",
      status: "Paused",
    },
    {
      id: 3,
      recipient: "0x0780.....93C",
      amountPerSecond: 30,
      startDate: "12th Feb 2025",
      endDate: "12th Mar 2025",
      token: "STRK",
      status: "Completed",
    },
  ];
  const [isPending, setIsPending] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsPending(false);
    }, 2000); // Simulate api call

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="w-full mt-6 text-[#E1E4EA]">
       <Tabs value={activeTab} defaultValue="incoming" className="w-full" onValueChange={setActiveTab}>
        <div className="flex justify-between items-center mb-4">
          <TabsList className="bg-[#242838] border-[#2A2E41] border-[1px]">
            <TabsTrigger 
              value="incoming" 
              className="data-[state=active]:bg-[#2A2E41] hover:cursor-pointer data-[state=active]:text-[#E1E4EA] text-[#D9D9D980]"
            >
              Incoming Streams
            </TabsTrigger>
            <TabsTrigger 
              value="outgoing"
              className="data-[state=active]:bg-[#2A2E41] hover:cursor-pointer data-[state=active]:text-[#E1E4EA] text-[#D9D9D980]"
            >
              Outgoing Streams
            </TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="incoming" className="mt-0">
          {isPending ? (
            <StreamsTableSkeleton />
          ) : (
            <StreamsTable 
              data={incomingStreams.filter(stream => 
                incomingStatusFilter === "all" || stream.status.toLowerCase() === incomingStatusFilter
              )}
              page={1}
              limit={10}
              totalCount={incomingStreams.length}
              onStatusFilterChange={setIncomingStatusFilter}
              statusFilter={incomingStatusFilter}
            />
          )}
        </TabsContent>

        <TabsContent value="outgoing" className="mt-0">
          {isPending ? (
            <StreamsTableSkeleton />
          ) : (
            <StreamsTable 
              data={outgoingStreams.filter(stream => 
                outgoingStatusFilter === "all" || stream.status.toLowerCase() === outgoingStatusFilter
              )}
              page={1}
              limit={10}
              totalCount={outgoingStreams.length}
              onStatusFilterChange={setOutgoingStatusFilter}
              statusFilter={outgoingStatusFilter}
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
 };
