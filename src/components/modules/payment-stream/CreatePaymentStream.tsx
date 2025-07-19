import AppSelect from "@/components/molecules/AppSelect";
import InputWithLabel from "@/components/molecules/InputWithLabel";
import { Input } from "@/components/ui/input";
import { capitalizeWord } from "@/lib/utills";

const CreatePaymentStream = () => {
  const durationOptions = ["hour", "day", "week", "month"].map((option) => ({
    label: capitalizeWord(option),
    value: option,
  }));

  return (
    <main className="grid grid-cols-12 gap-x-6 h-dvh w-full">
      <div className="col-span-8 h-full">
        <div className="flex gap-x-6 my-6">
          <InputWithLabel
            title="Name"
            name="name"
            placeholder="Fill in the name of the stream"
            // onChange={updateEqualDistributionAmount}
          />
          <InputWithLabel
            title="Token"
            name="token"
            placeholder="Choose a token"
            // onChange={updateEqualDistributionAmount}
          />
        </div>

        <div className="flex gap-x-6 my-6">
          <InputWithLabel
            title="Make the stream transferable?"
            name="transferable"
            placeholder="Yes"
            // onChange={updateEqualDistributionAmount}
          />

          <InputWithLabel
            title="Make the stream cancellable?"
            name="cancellable"
            placeholder="Yes"
            // onChange={updateEqualDistributionAmount}
          />
        </div>

        <div className="grid grid-cols-2 gap-x-6 my-6 ">
          <InputWithLabel
            title="Recipient"
            name="recipient"
            placeholder="Fill in the address"
            // onChange={updateEqualDistributionAmount}
          />

          <div className="grid grid-cols-[1.5fr_0.5fr] items-end gap-x-6">
            <AppSelect
              className="h-14"
              setValue={() => {}}
              options={durationOptions}
              placeholder="Select duration"
              title="Streaming Duration"
            />

            <Input
              className="border-none bg-fundable-mid-grey rounded h-14"
              placeholder="Amount"
            />
          </div>
        </div>
      </div>
      <div className="col-span-4 bg-red-400 h-full">Column 2</div>
    </main>
  );
};

export default CreatePaymentStream;
