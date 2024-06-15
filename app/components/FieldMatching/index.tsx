import React, { useCallback } from "react";
import Select from "~/components/Select";

interface FieldMatchingProps {
  fields: {[value: string]: string};
  availableKeys: string[];
  onChange: (obj: {[key: string]: string}) => void;
}

const FieldMatching = ({fields, availableKeys, onChange}: FieldMatchingProps) => {
  const keys= availableKeys.map(key => ({ id: key, value: key }));
  const dbKeys = Object.keys(fields).map(key => ({ id: key, value: key }));

  const onLocalChange = useCallback((dbValue: string, value: string) => {
    let _obj = Object.assign({}, fields);
    _obj[dbValue] = value;
    onChange(_obj);
  }, [fields, onChange])

  return (
    <div className={"w-[400px] flex flex-col items-center gap-2"}>
      {Object.entries(fields).map(([key, value]) =>
        <div className={"w-full flex justify-between items-center"}>
          <Select key={`${new Date().valueOf()}-1`} label={""} disabled onChange={() => {}} items={dbKeys} value={key} />
          -
          <Select key={`${new Date().valueOf()}-2`} label={""} onChange={(_value) => onLocalChange(key, _value)} items={keys} value={value} />
        </div>
      )}
    </div>
  );
};

export default FieldMatching;