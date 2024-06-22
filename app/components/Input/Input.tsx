import {
  HTMLInputAutoCompleteAttribute,
  HTMLInputTypeAttribute,
  useEffect,
  useRef,
} from "react";

import { Input as InputShadcn } from "~/components/shadcn/ui/input";
import { Textarea } from "~/components/shadcn/ui/textarea";

const Input = ({
  name,
  error,
  fullWidth,
  placeholder,
  initialValue,
  inputSettings,
  label,
  id,
  value,
  onChange,
  disabled,
}: InputProps) => {
  const inputRef = useRef(null);

  useEffect(() => {
    if (error) {
      inputRef.current.focus();
    }
  }, [error]);

  const inputComponent =
    inputSettings.variant === "textarea" ? (
      <Textarea
        id={id}
        ref={inputRef}
        name={name}
        rows={inputSettings.rows}
        required={inputSettings.required}
        autoComplete={inputSettings.autoComplete}
        defaultValue={initialValue ?? undefined}
        placeholder={placeholder}
        value={value || undefined}
        aria-invalid={!!error}
        aria-describedby={error ? `${name}-error` : undefined}
        disabled={disabled}
        onChange={(event) => onChange?.(event.target.value)}
      />
    ) : (
      <InputShadcn
        id={id}
        ref={inputRef}
        name={name}
        defaultValue={initialValue ?? undefined}
        value={value || undefined}
        type={inputSettings.type}
        required={inputSettings.required}
        autoComplete={inputSettings.autoComplete}
        aria-invalid={!!error}
        placeholder={placeholder}
        disabled={disabled}
        aria-describedby={error ? `${name}-error` : undefined}
        onChange={(event) => onChange?.(event.target.value)}
      />
    );

  return (
    <div className={`${fullWidth ? "w-full " : ""}flex flex-col gap-1`}>
      {label ? (
        <label htmlFor={id} className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      ) : null}
      {inputComponent}
      {error ? (
        <div className="pt-1 text-red-700" id={`${name}-error`}>
          {error}
        </div>
      ) : null}
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
    rows?: number;
    type?: HTMLInputTypeAttribute;
    required?: boolean;
    autoFocus?: boolean;
    autoComplete?: HTMLInputAutoCompleteAttribute;
  };
  onChange?: (value: string) => void;
  placeholder?: string;
  label?: string;
  value?: string;
  id: string;
  disabled?: boolean;
}
