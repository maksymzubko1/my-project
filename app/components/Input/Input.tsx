import React, { HTMLInputAutoCompleteAttribute, HTMLInputTypeAttribute, useEffect, useRef } from "react";

const Input = ({ name, error, fullWidth, placeholder, initialValue, inputSettings, label, id, value }: InputProps) => {
  const inputRef = useRef(null);

  useEffect(() => {
    if (error) {
      inputRef.current.focus();
    }
  }, [error, inputRef.current]);

  const inputComponent = inputSettings.variant === "textarea" ? (
    <textarea
      id={id}
      ref={inputRef}
      name={name}
      rows={inputSettings.rows}
      required={inputSettings.required}
      autoComplete={inputSettings.autoComplete}
      autoFocus={inputSettings.autoFocus}
      defaultValue={initialValue ?? ""}
      placeholder={placeholder}
      value={value || undefined}
      className={`flex-1 rounded-md border border-gray-500 px-2 py-1 text-lg`}
      aria-invalid={!!error}
      aria-describedby={
        error ? `${name}-error` : undefined
      }
    />
  ) : (
    <input
      id={id}
      ref={inputRef}
      name={name}
      defaultValue={initialValue ?? ""}
      value={value || undefined}
      type={inputSettings.type}
      required={inputSettings.required}
      autoComplete={inputSettings.autoComplete}
      autoFocus={inputSettings.autoFocus}
      className={`flex-1 rounded-md border border-gray-500 px-2 py-1 text-lg`}
      aria-invalid={!!error}
      placeholder={placeholder}
      aria-describedby={
        error ? `${name}-error` : undefined
      }
    />
  );

  return (
    <div className={`${fullWidth ? "w-full " : ""}flex flex-col gap-1`}>
      {label && <label htmlFor={id} className="block text-sm font-medium text-gray-700">
        {label}
      </label>}
      {inputComponent}
      {error && (
        <div className="pt-1 text-red-700" id={`${name}-error`}>
          {error}
        </div>
      )}
    </div>
  );
};

export default Input;

interface InputProps {
  name: string;
  error?: string;
  fullWidth?: boolean;
  initialValue?: string;
  inputSettings: {
    variant: "input" | "textarea";
    rows?: number
    type?: HTMLInputTypeAttribute;
    required?: boolean;
    autoFocus?: boolean;
    autoComplete?: HTMLInputAutoCompleteAttribute;
  };
  placeholder?: string;
  label?: string;
  value?: string;
  id: string;
}