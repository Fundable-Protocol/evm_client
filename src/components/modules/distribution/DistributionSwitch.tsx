import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { DistributionSelectorProps } from "@/types/distribution";

const DistributionTypeSwitch = ({
  distributionType,
  setDistributionType,
}: DistributionSelectorProps) => {
  const toggleDistributionType = (checked: boolean) => {
    setDistributionType((prev) => ({
      ...prev,
      type: checked ? "weighted" : "equal",
    }));
  };

  const distributionTypeValue = distributionType["type"];

  return (
    <div>
      <h3 className="mb-3">Distribution Type</h3>
      <div className="bg-fundable-mid-grey h-10 text-white py-3 rounded px-6 flex justify-center items-center gap-x-3 w-fit">
        <Label
          htmlFor="equal"
          className={`text-sm ${
            distributionType["type"] === "equal"
              ? "text-white"
              : "text-gray-400"
          }`}
        >
          Equal
        </Label>
        <Switch
          id={distributionTypeValue}
          checked={distributionTypeValue === "weighted"}
          onCheckedChange={toggleDistributionType}
        />
        <Label
          htmlFor="weighted"
          className={`text-sm ${
            distributionTypeValue === "weighted"
              ? "text-white"
              : "text-gray-400"
          }`}
        >
          Weighted
        </Label>
      </div>
    </div>
  );
};

export default DistributionTypeSwitch;
