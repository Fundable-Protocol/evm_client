import { ChangeEvent } from "react";
import toast from "react-hot-toast";

import { equalDistributionType } from "@/lib/constant";

import {
  distributionTypeKey,
  DistributionSelectorProps,
} from "@/types/distribution";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import AppSelect from "@/components/molecules/AppSelect";
import DistributionTypeSwitch from "./DistributionSwitch";
import { calculateLumpSumAmount } from "@/validations/distribution";

const DistributionSelector = ({
  supportedTokens,
  distributionData,
  distributionType,
  setDistributionData,
  setDistributionType,
}: DistributionSelectorProps) => {
  const handleDistributionTypeChange = (
    key: distributionTypeKey,
    value: string | number
  ) => {
    setDistributionType((prev) => ({
      ...prev,
      [key]: key === "amount" ? parseFloat(value as string) : value,
    }));
  };

  const updateEqualDistributionAmount = (e: ChangeEvent<HTMLInputElement>) => {
    handleDistributionTypeChange("amount", e.target.value);
  };

  const handleLumpSumCalculation = () => {
    const result = calculateLumpSumAmount({
      distributionType,
      setDistributionType,
      distributionData: distributionData!,
      setDistributionData: setDistributionData!,
    });

    if (result) {
      const { success, message } = result;
      if (!success) {
        toast.error(message);
      } else {
        toast.success(message);
      }
    }
  };

  return (
    <div className="flex flex-col xl:flex-row gap-y-6 xl:gap-y-0 gap-x-12 justify-between">
      <div className="flex gap-6 flex-col md:flex-row md:items-center pl-1">
        <AppSelect
          title="Token"
          placeholder="STRK"
          options={supportedTokens!}
          setValue={(value) =>
            handleDistributionTypeChange("selectedToken", value)
          }
        />

        <DistributionTypeSwitch
          distributionType={distributionType}
          setDistributionType={setDistributionType}
        />
      </div>
      {distributionType.type === "equal" ? (
        <div className="flex flex-col lg:flex-row lg:items-center gap-y-6 gap-x-6 ">
          <AppSelect
            placeholder="Equal Amount per address"
            title="Equal distribution type"
            options={[...equalDistributionType]}
            setValue={(value) =>
              handleDistributionTypeChange("equalAmountType", value)
            }
          />

          <div className="flex flex-col">
            <h3 className="font-semibold mb-3 text-nowrap">
              {distributionType["equalAmountType"] === "amount_per_address"
                ? "Amount per address"
                : "Lump sum to distribute."}
            </h3>

            {distributionType["equalAmountType"] === "lump_sum" ? (
              <div className="flex gap-x-3 items-center">
                <Input
                  className="border-none bg-fundable-mid-grey rounded"
                  name="amount"
                  placeholder="Amount"
                  onChange={updateEqualDistributionAmount}
                />
                <Button
                  variant="gradient"
                  className="rounded h-10"
                  onClick={handleLumpSumCalculation}
                >
                  Calculate
                </Button>
              </div>
            ) : (
              <Input
                className="border-none bg-fundable-mid-grey rounded"
                name="amount"
                placeholder="Amount"
                onChange={updateEqualDistributionAmount}
              />
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default DistributionSelector;
