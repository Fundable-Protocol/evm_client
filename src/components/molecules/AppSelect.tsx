import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const AppSelect = () => {
  return (
    <Select>
      <SelectTrigger className="w-[180px] border-none bg-[#1E212F] text-white">
        <SelectValue placeholder="STRK" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="light">Light</SelectItem>
        <SelectItem value="dark">Dark</SelectItem>
        <SelectItem value="system">System</SelectItem>
      </SelectContent>
    </Select>
  );
};

export default AppSelect;
