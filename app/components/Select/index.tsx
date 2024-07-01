import {
  CaretSortIcon,
  CheckIcon,
  InfoCircledIcon,
} from "@radix-ui/react-icons";
import React from "react";

import HiddenInput from "~/components/Input/HiddenInput";
import { Button } from "~/components/shadcn/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "~/components/shadcn/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/shadcn/ui/popover";
import ToolTip from "~/components/Tooltip/Tooltip";
import { cn } from "~/lib/utils";

interface SelectItem {
  id: string;
  value: string;
  label?: string;
  icon?: React.ReactNode | React.ExoticComponent;
}

interface SelectProps {
  label: string;
  items: SelectItem[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  showSelected?: boolean;
  name?: string;
  disableFilter?: boolean;
  error?: string;
  id?: string;
  tooltip?: string;
}

const Select = ({
  label,
  name,
  items,
  value,
  disableFilter,
  disabled,
  onChange,
  showSelected,
  placeholder,
  error,
  tooltip,
  id,
}: SelectProps) => {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      {name ? <HiddenInput name={name} value={value} /> : null}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger
          disabled={disabled}
          className="flex flex-col gap-1"
          asChild
        >
          <div className="w-fit">
            {label ? (
              <div className={"flex gap-1 items-center"}>
                <label
                  htmlFor={id}
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  {label}
                </label>
                {tooltip ? <ToolTip tooltip={tooltip}>
                    <InfoCircledIcon />
                  </ToolTip> : null}
              </div>
            ) : null}
            <Button
              id={id}
              type={"button"}
              variant="outline"
              disabled={disabled}
              aria-disabled={disabled}
              role="combobox"
              aria-expanded={open}
              className={`${showSelected !== false ? "w-[200px]" : ""} justify-between`}
            >
              {showSelected !== false
                ? value
                  ? items.find((item) => item.value === value)?.label ||
                    items.find((item) => item.value === value)?.value
                  : placeholder || "Select..."
                : null}
              <CaretSortIcon className="h-4 w-4 shrink-0 opacity-50" />
            </Button>
            {error ? (
              <div className="text-red-700" id={`${name}-error`}>
                {error}
              </div>
            ) : null}
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            {!disableFilter ? (
              <CommandInput placeholder="Search..." className="h-9" />
            ) : null}
            <CommandList id={id}>
              <CommandEmpty>No data found.</CommandEmpty>
              <CommandGroup>
                {items.map((item) => (
                  <CommandItem
                    key={item.id}
                    value={item.value}
                    onSelect={(currentValue) => {
                      onChange(currentValue === value ? "" : currentValue);
                      setOpen(false);
                    }}
                  >
                    <span className="flex items-center justify-between">
                      {item.icon ? <item.icon /> : null}{" "}
                      {item.label || item.value}
                    </span>
                    <CheckIcon
                      className={cn(
                        "ml-auto h-4 w-4",
                        value === item.value ? "opacity-100" : "opacity-0",
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </>
  );
};

export default Select;
