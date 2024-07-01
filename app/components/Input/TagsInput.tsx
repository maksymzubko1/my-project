import { Cross1Icon, InfoCircledIcon, PlusIcon } from "@radix-ui/react-icons";
import { ChangeEvent, useCallback, useState } from "react";

import HiddenInput from "~/components/Input/HiddenInput";
import { Badge } from "~/components/shadcn/ui/badge";
import ToolTip from "~/components/Tooltip/Tooltip";

interface TagsInputProps {
  error?: string;
  name: string;
  id: string;
  fullWidth?: boolean;
  label?: string;

  tooltip?: string;
  value: string[];
  onChange: (value: string[]) => void;
}

const TagsInput = ({
  error,
  name,
  id,
  fullWidth,
  label,
  onChange,
  tooltip,
  value,
}: TagsInputProps) => {
  const [inputValue, setInputValue] = useState<string>("");

  const handleInputChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  }, []);

  const handleTagRemove = useCallback(
    (_, tag: string) => {
      onChange(value.filter((_tag) => _tag !== tag));
    },
    [onChange, value],
  );

  const handleTagAdd = useCallback(() => {
    const newTag = inputValue.trim();
    if (newTag !== "" && !value.includes(newTag)) {
      onChange([...value, newTag]);
      setInputValue("");
    }
  }, [inputValue, onChange, value]);

  return (
    <div className={`${fullWidth ? "w-full " : ""}flex flex-col gap-1`}>
      <HiddenInput name={name} value={value.join(",") || ""} />
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
      <div className="tags-input flex-1 rounded-md text-lg">
        <ul className="tags-list flex gap-2 flex-wrap items-center">
          {value?.map((tag, index) => (
            <li key={index} className="[&>div]:py-2 [&>div]:px-3">
              <Badge variant="outline">
                {tag}
                <button
                  type={"button"}
                  className="tag-remove ms-3 transition-all hover:text-red-700"
                  onClick={(event) => handleTagRemove(event, tag)}
                >
                  <Cross1Icon />
                </button>
              </Badge>
            </li>
          ))}
          <li className="flex gap-2 tag-input rounded-md border border-gray-500 px-1 py-1 text-lg">
            <input
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              className={"focus:outline-none"}
              placeholder="Add tags..."
            />
            <button
              type={"button"}
              className="transtion-all hover:text-blue-500"
              onClick={handleTagAdd}
            >
              <PlusIcon />
            </button>
          </li>
        </ul>
      </div>
      {error ? (
        <div className="pt-1 text-red-700" id={`${name}-error`}>
          {error}
        </div>
      ) : null}
    </div>
  );
};

export default TagsInput;
