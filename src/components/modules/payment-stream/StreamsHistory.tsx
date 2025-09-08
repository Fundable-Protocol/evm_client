import { useState } from "react";
import { Stream } from "@/types/payment-stream";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import CreatePaymentStream from "./CreatePaymentStream";

export const StreamsHistory = () => {
  const [incomingCurrentPage, setIncomingCurrentPage] = useState(1);
  const [outgoingCurrentPage, setOutgoingCurrentPage] = useState(1);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const totalPages = 2;

  const CustomPagination = ({
    currentPage,
    onPrevious,
    onNext,
  }: {
    currentPage: number;
    onPrevious: () => void;
    onNext: () => void;
  }) => (
    <div className="flex justify-between items-center mt-4 mb-8">
      <div className="text-[#D9D9D980] sm:text-sm text-xs">
        Page {currentPage} of {totalPages}
      </div>
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onPrevious}
          disabled={currentPage === 1}
          className="text-[#D9D9D9] sm:text-sm text-xs font-medium md:py-4 py-2 px-2 font-urbanist bg-transparent border-[#CDCDCD] border-[1px] rounded-[4px] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onNext}
          disabled={currentPage === totalPages}
          className="text-[#D9D9D9] sm:text-sm text-xs font-medium md:py-4 py-2 px-2 font-urbanist bg-transparent border-[#CDCDCD] border-[1px] rounded-[4px] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </Button>
      </div>
    </div>
  );
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

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-[#F4FBF6] border-[#D6F1DF] border-[1px] rounded-[8px] text-[#2B9A66] px-2 py-[6px]";
      case "Paused":
        return "bg-[#FFF7F7] border-[#FFDBDC] border-[1px] rounded-[8px] text-[#FF9500] px-2 py-[6px]";
      case "Completed":
        return "bg-[#F4FBF6] border-[#D6F1DF] border-[1px] rounded-[8px] text-[#2B9A66] px-2 py-[6px]";
      default:
        return "bg-[#F3F4F6] border-[#E5E7EB] border-[1px] rounded-[8px] text-gray-800 px-2 py-[6px]";
    }
  };

  const getTokenIcon = (token: string) => {
    switch (token) {
      case "XLM":
        return "stellar_xlm";
      case "TON":
        return "ton";
      case "STRK":
        return "starknet";
      default:
        return "starknet";
    }
  };

  const StreamTable = ({
    streams,
    title,
  }: {
    streams: Stream[];
    title: string;
  }) => (
    <div className="w-full text-[#E1E4EA] ">
      <div className="mb-2 border-b-[2px] border-[#2A2E41]">
        <h2 className="text-xl md:text-[32px] mb-4 font-semibold font-urbanist">
          {title}
        </h2>
      </div>
        {title === "Incoming Streams" && (
          <div className="flex justify-end border-b-[2px] border-[#2A2E41] items-end m-0">
            <button 
              onClick={() => setIsCreateModalOpen(true)}
              className="px-4 py-2 mb-0 bg-[#242838] border-[2px] border-b-0 border-[#2A2E41] rounded-t-[4px] flex items-center gap-2 hover:cursor-pointer hover:bg-gray-700"
            >
              <span>+</span>
              New Stream
            </button>
          </div>
        )}

      <div className="overflow-x-auto">
        <table className="w-full mt-0 font-urbanist">
          <thead className="text-white text-center">
            <tr className="text-center text-sm md:text-base">
              <th className="px-6 py-4 bg-[#21163F] sm:w-[130px] border-l-0 border border-[#CDCDCD0D] font-bold">
                Stream ID
              </th>
              <th className="px-6 py-4 bg-[#1F1F32] border-t-[1px] border-[#CDCDCD0D] font-bold">
                Recipient Address
              </th>
              <th className="px-6 py-4 bg-[#1F1F32] w-[142px] border-t-[1px] border-[#CDCDCD0D] font-bold">
                Amount Per Second
              </th>
              <th className="px-6 py-4 bg-[#1F1F32] border-t-[1px] border-[#CDCDCD0D] font-bold">
                Start Date
              </th>
              <th className="px-6 py-4 bg-[#1F1F32] border-t-[1px] border-[#CDCDCD0D] font-bold">
                End Date
              </th>
              <th className="px-6 py-4 bg-[#1F1F32] border-t-[1px] border-[#CDCDCD0D] font-bold">
                Token
              </th>
              <th className="px-6 py-4 bg-[#1F1F32] border-t-[1px] border-[#CDCDCD0D] font-bold">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="bg-[#1E212F] text-center text-sm md:text-base">
            {streams.map((stream, index) => (
              <tr
                key={stream.id}
                className={
                  index !== streams.length
                    ? "border-l-0 border border-[#CDCDCD0D]"
                    : ""
                }
              >
                <td className="px-6 py-4  border-l-0 border sm:w-[130px] text-center border-[#CDCDCD0D] bg-[#21163F]">
                  {stream.id}
                </td>
                <td className="px-6 py-4 ">{stream.recipient}</td>
                <td className="px-6 py-4 w-[142px]">
                  {stream.amountPerSecond}
                </td>
                <td className="px-6 py-4 ">{stream.startDate}</td>
                <td className="px-6 py-4 ">{stream.endDate}</td>
                <td className="px-6 py-4 ">
                  <div className="flex items-center justify-center gap-2">
                    <Image
                      src={`/svgs/${getTokenIcon(stream.token)}.svg`}
                      alt={stream.token}
                      width={32}
                      height={32}
                      className="w-6 h-6 md:w-8 md:h-8"
                    />
                    <span>{stream.token}</span>
                  </div>
                </td>
                <td className="px-6 py-4 ">
                  <span
                    className={`${getStatusStyle(stream.status)} font-inter text-xs md:text-base`}
                  >
                    {stream.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="">
      {!isCreateModalOpen ? (
        <>
          <StreamTable streams={incomingStreams} title="Incoming Streams" />

          <CustomPagination
            currentPage={incomingCurrentPage}
            onPrevious={() =>
              setIncomingCurrentPage((prev) => Math.max(1, prev - 1))
            }
            onNext={() =>
              setIncomingCurrentPage((prev) => Math.min(totalPages, prev + 1))
            }
          />

          <StreamTable streams={outgoingStreams} title="Outgoing Streams" />

          <CustomPagination
            currentPage={outgoingCurrentPage}
            onPrevious={() =>
              setOutgoingCurrentPage((prev) => Math.max(1, prev - 1))
            }
            onNext={() =>
              setOutgoingCurrentPage((prev) => Math.min(totalPages, prev + 1))
            }
          />
        </>
      ) : (
        <div className="w-full">
          {/* Header with back button */}
          <div className="flex items-center mb-6">
            <button
              onClick={() => setIsCreateModalOpen(false)}
              className="flex items-center gap-2 hover:cursor-pointer text-[#E1E4EA] hover:text-white transition-colors"
            >
              <span className="text-xl">←</span>
              <span className="font-urbanist">Back</span>
            </button>
          </div>
          
          {/* Create Payment Stream Component */}
          <CreatePaymentStream />
        </div>
      )}
     </div>
   );
 };
