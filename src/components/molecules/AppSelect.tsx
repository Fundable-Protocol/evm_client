import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const AppSelect = ({
  title,
  options,
}: {
  title: string;
  options: { label: string; value: string }[];
}) => {
  return (
    <Select>
      <div className="flex flex-col w-full">
        <h3 className="font-semibold mb-3">{title}</h3>
        <SelectTrigger className="w-full border-none bg-fundable-mid-grey text-white">
          <SelectValue placeholder="STRK" />
        </SelectTrigger>
        <SelectContent>
          {options?.map((option) => (
            <SelectItem
              key={option.value}
              value={option.value}
              className="text-white bg-[#252939] hover:bg-[#252939] hover:text-white"
            >
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </div>
    </Select>
  );
};

export default AppSelect;
