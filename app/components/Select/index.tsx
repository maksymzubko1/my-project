import React, { useState } from "react";

interface SelectItem {
  id: string;
  value: string;
}

interface SelectProps {
  label: string;
  items: SelectItem[];
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

const Select = ({label, items, value, disabled, onChange}: SelectProps) => {
  const [id] = useState(`select-${new Date().valueOf()}`);

  return (
    <div className="max-w-sm mx-auto">
      <label htmlFor={id} className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">{label}</label>
      <select onChange={(event) => onChange(event.target.value)} value={value} disabled={disabled} id={id}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
        {items.map(item => (
          <option value={item.id}>{item.value}</option>
        ))}
      </select>
    </div>
  );
};

export default Select;