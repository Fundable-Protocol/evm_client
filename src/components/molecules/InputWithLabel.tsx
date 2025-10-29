import { cn } from "@/lib/utils";
import { Input } from "../ui/input";

interface InputWithLabelProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  title?: string;
}

const InputWithLabel = ({
  title,
  className,
  ...props
}: InputWithLabelProps) => {
  return (
    <div className="flex flex-col w-full">
      {title && (
        <h3 className="text-fundable-light-grey mb-3 text-nowrap">{title}</h3>
      )}

      <Input
        className={cn(
          "border-none bg-fundable-mid-grey rounded h-12 placeholder:text-fundable-placeholder",
          className
        )}
        {...props}
      />
    </div>
  );
};

export default InputWithLabel;
