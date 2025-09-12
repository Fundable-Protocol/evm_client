import AppSelect from "@/components/molecules/AppSelect";
import InputWithLabel from "@/components/molecules/InputWithLabel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AppSelectProps } from "@/types";
import { StreamData } from "@/types/payment-stream";
import { Lock } from "lucide-react";
import { Dispatch, SetStateAction } from "react";

const PaymentStreamForm = ({
  streamData,
  tokenOptions,
  setStreamData,
  durationOptions,
  onSubmit,
  isSubmitting,
}: {
  streamData: StreamData;
  tokenOptions: AppSelectProps["options"];
  durationOptions: AppSelectProps["options"];
  setStreamData: Dispatch<SetStateAction<StreamData>>;
  onSubmit: () => void;
  isSubmitting?: boolean;
}) => {
  const transferabilityOptions = [true, false].map((option) => ({
    label: option ? "Yes" : "No",
    value: option,
  }));

  const handleStreamDataChange = (
    key: keyof typeof streamData,
    value: string | number
  ) => {
    setStreamData((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="w-full xl:w-[70%] h-full flex flex-col">
      <div>
        <div className="grid lg:grid-cols-2 gap-6 my-6">
          <InputWithLabel
            title="Name"
            name="name"
            placeholder="Fill in the name of the stream"
            onChange={(e) => handleStreamDataChange("name", e.target.value)}
          />
          <InputWithLabel
            title="Total Amount"
            name="amount"
            placeholder="Enter total amount to stream"
            onChange={(e) => handleStreamDataChange("amount", e.target.value)}
          />
        </div>

        <div className="grid lg:grid-cols-2 gap-6 my-6">
          <AppSelect
            className="h-14 placeholder:text-fundable-placeholder"
            titleclassname="text-fundable-light-grey"
            setValue={(value) => handleStreamDataChange("token", value)}
            options={tokenOptions}
            title="Token"
            placeholder={streamData.token}
          />
          <AppSelect
            className="h-14 placeholder:text-fundable-placeholder"
            titleclassname="text-fundable-light-grey"
            setValue={(value) =>
              handleStreamDataChange("transferability", value)
            }
            options={transferabilityOptions}
            title="Make the stream transferable?"
            placeholder={streamData.transferability ? "Yes" : "No"}
          />
        </div>

        <div className="grid lg:grid-cols-2 gap-6 my-6">
          <AppSelect
            className="h-14 placeholder:text-fundable-placeholder"
            titleclassname="text-fundable-light-grey"
            setValue={(value) =>
              handleStreamDataChange("cancellability", value)
            }
            options={transferabilityOptions}
            title="Make the stream cancellable?"
            placeholder={streamData.cancellability ? "Yes" : "No"}
          />
          <InputWithLabel
            title="Recipient"
            name="recipient"
            placeholder="Fill in the address"
            onChange={(e) =>
              handleStreamDataChange("recipient", e.target.value)
            }
          />
        </div>

        <div className="grid lg:grid-cols-2 gap-6 my-6 ">
          <div className="flex flex-col">
            <h3 className="font-semibold text-fundable-white mb-3 text-nowrap">
              Streaming Duration
            </h3>
            <div className="w-full grid grid-cols-[0.5fr_1.5fr] items-end gap-x-6">
              <Input
                className="border-none bg-fundable-mid-grey rounded h-14 placeholder:text-fundable-placeholder"
                maxLength={streamData.duration === "hour" ? 1 : 3}
                placeholder="Value eg. 1"
                value={streamData.durationValue}
                onChange={(e) =>
                  handleStreamDataChange("durationValue", e.target.value)
                }
              />
              <AppSelect
                className="h-14"
                setValue={(value) => handleStreamDataChange("duration", value)}
                options={durationOptions}
                placeholder="Pick a duration"
              />
            </div>
          </div>
                
          <Button
            size="lg"
            variant="gradient"
            className="self-end h-14 w-fit"
            disabled={
              isSubmitting ||
              !streamData.name ||
              !streamData.durationValue ||
              !streamData.recipient
            }
            onClick={onSubmit}
          >
            <span>{isSubmitting ? "Processing..." : "Continue"}</span>
            <Lock className="w-[0.7rem] h-[0.91rem] font-bold" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PaymentStreamForm;
