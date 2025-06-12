import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { DistributionSelectorProps } from "@/types/distribution";

const DistributionLabelSwitch = ({
  distributionType,
  setDistributionType,
}: DistributionSelectorProps) => {
  const toggleDistributionLabel = (checked: boolean) => {
    setDistributionType((prev) => ({
      ...prev,
      showLabel: checked ? true : false,
    }));
  };

  const distributionTypeValue = distributionType["showLabel"];

  return (
    <div>
      <h3 className="font-semibold mb-3">Show Address Label</h3>
      <div className="bg-fundable-mid-grey h-10 text-white py-3 rounded px-6 flex justify-center items-center gap-x-3 w-fit">
        <Label
          htmlFor="disable-label"
          className={`text-sm ${
            distributionTypeValue === false ? "text-white" : "text-gray-400"
          }`}
        >
          No
        </Label>
        <Switch
          id="enable-label"
          checked={distributionTypeValue === true}
          onCheckedChange={toggleDistributionLabel}
        />
        <Label
          htmlFor="enable-label"
          className={`text-sm ${
            distributionTypeValue === true ? "text-white" : "text-gray-400"
          }`}
        >
          Yes
        </Label>
      </div>
    </div>
  );
};

export default DistributionLabelSwitch;
