import { capitalizeWord } from "@/lib/utills";
import { StreamData } from "@/types/payment-stream";

const PaymentStreamSummary = ({ streamData }: { streamData: StreamData }) => {
  const streamSummary = Object.entries(streamData)
    .map(([key, value]) =>
      key === "durationValue"
        ? null
        : {
            label: capitalizeWord(key) + ":",
            value:
              key === "duration"
                ? `${streamData.durationValue} ${capitalizeWord(
                    streamData.duration
                  )}${+streamData.durationValue > 1 ? "s" : ""}`
                : ["cancellability", "transferability"].includes(key)
                ? value
                  ? "Yes"
                  : "No"
                : value,
          }
    )
    .filter(Boolean);

  return (
    <div className="col-span-3 flex flex-col gap-y-4 p-6 rounded-[0.75rem] bg-fundable-mid-grey/50 h-max">
      <h2 className="font-semibold text-fundable-white mb-3 text-nowrap pb-4 border-b border-fundable-light-grey">
        Summary
      </h2>
      <div className="flex flex-col gap-y-6">
        {streamSummary.map((item) => (
          <div className="flex justify-between" key={item?.label}>
            <span className="text-fundable-light-grey font-semibold font-urbanist">
              {item?.label}
            </span>
            <span className="text-fundable-placeholder font-medium font-urbanist">
              {item?.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PaymentStreamSummary;
