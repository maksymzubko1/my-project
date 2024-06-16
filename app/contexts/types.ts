import { FormEvent } from "react";

type ChangeHandler<T> = (value: T[keyof T], field: keyof T) => void;

export interface FormProps<T, D> {
  errors?: {
    [K in keyof T]?: string;
  };
  onChange: ChangeHandler<T>;
  onSubmit: (
    event?: FormEvent<HTMLFormElement> | null,
    action?: string,
  ) => void;
  values: T;
  extras?: D;
  isLoading?: boolean;
}
