import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utills";
import { AppSelectProps } from "@/types";

const AppSelect = ({
  title,
  options,
  setValue,
  placeholder,
  className,
}: AppSelectProps) => {
  return (
    <Select onValueChange={setValue}>
      <div className="flex flex-col min-w-max">
        {!!title && <h3 className="font-semibold mb-3 text-nowrap">{title}</h3>}
        <SelectTrigger
          className={cn(
            "w-full border-none bg-fundable-mid-grey text-white",
            className
          )}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options?.map((option) => {
            return (
              <SelectItem
                key={option.value}
                value={option.value}
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
