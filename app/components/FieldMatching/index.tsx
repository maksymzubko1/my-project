import { InfoCircledIcon } from "@radix-ui/react-icons";
import { useCallback } from "react";

import Select from "~/components/Select";
import ToolTip from "~/components/Tooltip/Tooltip";

interface FieldMatchingProps {
  fields: Record<string, string>;
  availableKeys: string[];
  onChange: (obj: Record<string, string>) => void;
  error?: string;
  label?: string;
}

const FieldMatching = ({
  fields,
  availableKeys,
  onChange,
  error,
  label,
}: FieldMatchingProps) => {
  const keys = availableKeys.map((key) => ({ id: key, value: key }));
  const dbKeys = Object.keys(fields).map((key) => ({ id: key, value: key }));

  const onLocalChange = useCallback(
    (dbValue: string, value: string) => {
      const _obj = Object.assign({}, fields);
      _obj[dbValue] = value;
      onChange(_obj);
    },
    [fields, onChange],
  );

  return (
    <div className={"w-[400px] flex flex-col items-center gap-2"}>
      {label ? (
        <div className={"flex gap-1 items-center w-full"}>
          <label className="block text-start text-sm font-medium text-gray-700">
            {label}
          </label>
          <ToolTip
            tooltip={
              "This is a set of data of the key-value type, \nwhere the keys are the columns from the database (left column)\n and the keys from rss (right column) are the values."
            }
          >
            <InfoCircledIcon />
          </ToolTip>
        </div>
      ) : null}
      {Object.entries(fields).map(([key, value], index) => (
        <div
          key={`${new Date().valueOf()}-${index}`}
          className={"w-full flex justify-between gap-2 items-center"}
        >
          <Select
            label={""}
            disabled
            onChange={() => {
              console.log("changed initial");
            }}
            items={dbKeys}
            value={key}
          />
          -
          <Select
            label={""}
            onChange={(_value) => onLocalChange(key, _value)}
            items={keys}
            value={value}
          />
        </div>
      ))}
      {error ? (
        <div className="text-red-700 text-start w-full" id={`${name}-error`}>
          {error}
        </div>
      ) : null}
    </div>
  );
};

export default FieldMatching;
