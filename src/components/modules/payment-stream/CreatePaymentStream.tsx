import { useState } from "react";
import { useNetwork } from "@starknet-react/core";

import { Input } from "@/components/ui/input";
import AppSelect from "@/components/molecules/AppSelect";
import { capitalizeWord, getTokenOptions } from "@/lib/utills";
import InputWithLabel from "@/components/molecules/InputWithLabel";
import { Button } from "@/components/ui/button";
import { Lock } from "lucide-react";
import PaymentStreamSummary from "./PaymentStreamSummary";

const CreatePaymentStream = () => {
  const { chain } = useNetwork();
  const { tokenOptions } = getTokenOptions(chain);

  const durationOptions = ["hour", "day", "week", "month"].map((option) => ({
    label: capitalizeWord(option),
    value: option,
  }));

  const transferabilityOptions = [true, false].map((option) => ({
    label: option ? "Yes" : "No",
    value: option,
  }));

  const [streamData, setStreamData] = useState({
    name: "",
    recipient: "",
    token: tokenOptions[0].value,
    duration: durationOptions[0].value,
    durationValue: "",
    cancellability: false,
    transferability: false,
  });

  const handleStreamDataChange = (
    key: keyof typeof streamData,
    value: string | number
  ) => {
    setStreamData((prev) => ({ ...prev, [key]: value }));
  };

  const handleStreamDataSubmit = () => {
    console.log(streamData);
  };

  return (
    <main className="grid grid-cols-12 gap-x-6 h-dvh w-full">
      <div className="col-span-8 h-full flex flex-col">
        <div>
          <div className="grid grid-cols-2 gap-x-6 my-6">
            <InputWithLabel
              title="Name"
              name="name"
              placeholder="Fill in the name of the stream"
              onChange={(e) => handleStreamDataChange("name", e.target.value)}
            />

            <AppSelect
              className="h-14 placeholder:text-fundable-placeholder"
              titleclassname="text-fundable-light-grey"
              setValue={(value) => handleStreamDataChange("token", value)}
              options={tokenOptions}
              title="Token"
              placeholder="Choose a token..."
            />
          </div>

          <div className="grid grid-cols-2 gap-x-6 my-6">
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
          </div>

          <div className="grid grid-cols-2 gap-x-6 my-6 ">
            <InputWithLabel
              title="Recipient"
              name="recipient"
              placeholder="Fill in the address"
              onChange={(e) =>
                handleStreamDataChange("recipient", e.target.value)
              }
            />

            <div className="flex flex-col">
              <h3 className="font-semibold text-fundable-white mb-3 text-nowrap">
                Streaming Duration
              </h3>
              <div className="grid grid-cols-[0.5fr_1.5fr] items-end gap-x-6">
                <Input
                  className="border-none bg-fundable-mid-grey rounded h-14 placeholder:text-fundable-placeholder"
                  placeholder="Value eg. 1"
                  value={streamData.durationValue}
                  onChange={(e) =>
                    handleStreamDataChange("durationValue", e.target.value)
                  }
                />
                <AppSelect
                  className="h-14"
                  setValue={(value) =>
                    handleStreamDataChange("duration", value)
                  }
                  options={durationOptions}
                  placeholder="Pick a duration"
                />
              </div>
            </div>
          </div>
        </div>

        <Button
          size="lg"
          variant="gradient"
          className="self-end w-fit"
          disabled={
            !streamData.name ||
            !streamData.durationValue ||
            !streamData.recipient
          }
          onClick={handleStreamDataSubmit}
        >
          <span>Continue</span>
          <Lock className="w-[0.7rem] h-[0.91rem] font-bold" />
        </Button>
      </div>
      <PaymentStreamSummary streamData={streamData} />
    </main>
  );
};

export default CreatePaymentStream;
