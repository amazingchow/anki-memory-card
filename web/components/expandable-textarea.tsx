import * as React from "react";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ExpandableTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
}

export function ExpandableTextarea({ label, value: externalValue, ...props }: ExpandableTextareaProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [value, setValue] = React.useState(externalValue || '');

  React.useEffect(() => {
    setValue(externalValue || '');
  }, [externalValue]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value);
    props.onChange?.(e);
  };

  return (
    <>
      <Textarea
        {...props}
        value={value}
        onChange={handleChange}
        onClick={() => setIsOpen(true)}
        className="cursor-pointer"
      />
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-xl h-[50vh] p-2">
          <DialogHeader className="pb-0.5">
            <DialogTitle className="text-xs">{label}</DialogTitle>
          </DialogHeader>
          <Textarea
            {...props}
            value={value}
            onChange={handleChange}
            className="h-[calc(100%-1.5rem)] resize-none"
          />
        </DialogContent>
      </Dialog>
    </>
  );
} 