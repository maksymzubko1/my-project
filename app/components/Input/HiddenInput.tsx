import React from "react";

interface HiddenInputProps {
  name: string;
  value?: string;
}

const HiddenInput = ({name, value}: HiddenInputProps) => {
  return (
    <input
      name={name}
      value={value}
      type={"hidden"}
    />
  );
};

export default HiddenInput;