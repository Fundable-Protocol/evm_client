import { useEffect, useState } from "react";
import { Stream } from "@/types/payment-stream";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import StreamsTable from "./StreamsTable";
import StreamsTableSkeleton from "./StreamsTableSkeleton";
import AppSelect from "@/components/molecules/AppSelect";
import { capitalizeWord } from "@/lib/utils";

export const StreamsHistory = () => {
  const [activeTab, setActiveTab] = useState("incoming");
  const [statusFilter, setStatusFilter] = useState("all");

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

  const statusOptions = ["all", "active", "paused", "completed"].map(
    (status) => ({
      label: capitalizeWord(status),
      value: status,
    })
  );

  const tabTriggerValues = ["incoming", "outgoing"];

  const handleStatusChange = (value: string) => {
    setStatusFilter(value);
  };

  return (
    <div className="w-full mt-6 text-[#E1E4EA]">
      <h1 className="font-syne font-medium pb-2 border-b border-b-gray-700 w-full mb-4">
        Streams History
      </h1>

      <Tabs
        value={activeTab}
        defaultValue="incoming"
        className="w-full"
        onValueChange={setActiveTab}
      >
        <div className="flex mb-2 items-center w-full gap-x-6">
          <TabsList className="bg-[#242838] p-1 rounded-xs h-auto">
            {tabTriggerValues.map((value) => (
              <TabsTrigger
                key={value}
                value={value}
                className="data-[state=active]:bg-[#2A2E41] hover:cursor-pointer data-[state=active]:text-[#E1E4EA] text-text-fundable-mid-grey rounded-xs"
              >
                {value === "incoming" ? "Incoming Streams" : "Outgoing Streams"}
              </TabsTrigger>
            ))}
          </TabsList>

          <AppSelect
            placeholder={
              statusOptions.find((opt) => opt.value === statusFilter)?.label ||
              statusOptions[0].label
            }
            options={statusOptions}
            setValue={handleStatusChange}
            className="w-full lg:w-3xs"
          />
        </div>

        <TabsContent value="incoming">
          {isPending ? (
            <StreamsTableSkeleton />
          ) : (
            <StreamsTable
              data={incomingStreams.filter(
                (stream) =>
                  statusFilter === "all" ||
                  stream.status.toLowerCase() === statusFilter
              )}
              page={1}
              limit={10}
              totalCount={incomingStreams.length}
            />
          )}
        </TabsContent>

        <TabsContent value="outgoing">
          {isPending ? (
            <StreamsTableSkeleton />
          ) : (
            <StreamsTable
              data={outgoingStreams.filter(
                (stream) =>
                  statusFilter === "all" ||
                  stream.status.toLowerCase() === statusFilter
              )}
              page={1}
              limit={10}
              totalCount={outgoingStreams.length}
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};
