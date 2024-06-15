import React, { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "~/components/shadcn/ui/popover";
import { Button } from "~/components/shadcn/ui/button";
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";
import { cn } from "~/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from "~/components/shadcn/ui/command";
import HiddenInput from "~/components/Input/HiddenInput";

interface SelectItem {
  id: string;
  value: string;
  label?: string;
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
                  placeholder
                }: SelectProps) => {
  const [id] = useState(`select-${new Date().valueOf()}`);
  const [open, setOpen] = React.useState(false);

  return (
    <>
      {name && <HiddenInput name={name} value={value} />}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger disabled={disabled} asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={`${showSelected !== false ? "w-[200px]" : ""} justify-between`}
          >
            {showSelected !== false &&
              (value
                ? items.find((item) => item.value === value)?.label
                || items.find((item) => item.value === value)?.value
                : placeholder || "Select...")
            }
            <CaretSortIcon className="h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            {!disableFilter && <CommandInput placeholder="Search..." className="h-9" />}
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
                    {item.label || item.value}
                    <CheckIcon
                      className={cn(
                        "ml-auto h-4 w-4",
                        value === item.value ? "opacity-100" : "opacity-0"
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
