import { useState } from "react";
import { useNetwork } from "@starknet-react/core";

import PaymentStreamForm from "./PaymentStreamForm";
import PaymentStreamSummary from "./PaymentStreamSummary";
import { capitalizeWord, getTokenOptions } from "@/lib/utills";

const CreatePaymentStream = () => {
  const { chain } = useNetwork();
  const { tokenOptions } = getTokenOptions(chain);

  const durationOptions = ["hour", "day", "week", "month"].map((option) => ({
    label: capitalizeWord(option),
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

  // const handleStreamDataSubmit = () => {
  //   console.log(streamData);
  // };

  return (
    <main className="flex gap-x-6 h-dvh w-full justify-between">
      <PaymentStreamForm
        streamData={streamData}
        tokenOptions={tokenOptions}
        setStreamData={setStreamData}
        durationOptions={durationOptions}
      />
      <PaymentStreamSummary streamData={streamData} />
    </main>
  );
};

export default CreatePaymentStream;
