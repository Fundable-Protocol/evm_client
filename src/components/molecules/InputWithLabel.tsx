import { cn } from "@/lib/utills";
import { Input } from "../ui/input";

interface InputWithLabelProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  title: string;
}

const InputWithLabel = ({
  title,
  className,
  ...props
}: InputWithLabelProps) => {
  return (
    <div className="flex flex-col w-full">
      <h3 className="font-semibold text-fundable-white mb-3 text-nowrap">
        {title}
      </h3>
      <Input
        className={cn(
          "border-none bg-fundable-mid-grey rounded h-14",
          className
        )}
        {...props}
      />
    </div>
  );
};

export default InputWithLabel;
