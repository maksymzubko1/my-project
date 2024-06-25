import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";
import React, {
  useId,
} from "react";

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
import { cn } from "~/lib/utils";

interface IPostSelectorProps {
  isLoading: boolean;
  disabled?: boolean;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  items: { id: string; title: string }[];
}

const PostSelector = ({
  isLoading,
  disabled,
  value,
  onChange,
  error,
  items,
}: IPostSelectorProps) => {
  const id = useId();
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open ? !isLoading : null} onOpenChange={setOpen}>
      <PopoverTrigger
        disabled={disabled}
        className="flex flex-col gap-1"
        asChild
      >
        <div className="w-fit">
          <label
            htmlFor={id}
            className="block text-sm font-medium text-gray-700"
          >
            Post
          </label>
          <Button
            id={id}
            type={"button"}
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={`w-[200px] justify-between`}
          >
            {value
              ? items
                  .find((item) => item.id === value)
                  ?.title?.substring(0, 20) + "..."
              : "Select post..."}
            <CaretSortIcon className="h-4 w-4 shrink-0 opacity-50" />
          </Button>
          {error ? (
            <div className="text-red-700" id={`post-selector-error`}>
              {error}
            </div>
          ) : null}
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search post..." className="h-9" />
          <CommandList id={id}>
            <CommandEmpty>No data found.</CommandEmpty>
            <CommandGroup>
              {items.map((item) => (
                <CommandItem
                  key={item.id}
                  value={item.id}
                  onSelect={(currentValue) => {
                    onChange(currentValue === value ? "" : currentValue);
                    setOpen(false);
                  }}
                >
                  {item.title.substring(0, 20) + "..."}
                  <CheckIcon
                    className={cn(
                      "ml-auto h-4 w-4",
                      value === item.id ? "opacity-100" : "opacity-0",
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default PostSelector;
