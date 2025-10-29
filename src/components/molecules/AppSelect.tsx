import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AppSelectProps } from "@/types";

const AppSelect = ({
  title,
  options,
  setValue,
  placeholder,
}: AppSelectProps) => {
  return (
    <Select onValueChange={setValue}>
      <div className="flex flex-col min-w-max">
        <h3 className="font-semibold mb-3 text-nowrap">{title}</h3>
        <SelectTrigger className="w-full border-none bg-fundable-mid-grey text-white">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options?.map((option) => {
            return (
              <SelectItem
                key={option.value as unknown as string}
                value={option.value as unknown as string}
                className="text-white bg-[#252939] hover:bg-[#252939] hover:text-white"
              >
                {option.label}
              </SelectItem>
            );
          })}
        </SelectContent>
      </div>
    </Select>
  );
};

export default AppSelect;
