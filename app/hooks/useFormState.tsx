import { useFetcher } from "@remix-run/react";
import { HTMLFormMethod } from "@remix-run/router";
import { useCallback, useEffect, useRef, useState } from "react";

type IgnoreFields<T> = (keyof T)[];

type FormState<T> = {
  [K in keyof T]: T[K];
};

type EncType =
  | "application/json"
  | "application/x-www-form-urlencoded"
  | "multipart/form-data";

type OnChangeFunction<T> = (value: T[keyof T], field: keyof T) => void;
type OnSubmitFunction<T> = (
  values: T,
  {
    methodType,
    encType,
  }?: {
    methodType?: HTMLFormMethod;
    encType?: EncType;
  },
) => void;

const useFormState = <T extends FormState<T>>(
  initialState: T,
  {
    ignoreFields,
    syncOnUpdate,
  }: {
    ignoreFields?: IgnoreFields<T>;
    syncOnUpdate?: boolean;
  } = {},
) => {
  const [isDirty, setIsDirty] = useState<boolean>(false);
  const [state, setState] = useState<T>(initialState);
  const prevDataRef = useRef<T | null>(null);
  const fetcher = useFetcher();

  useEffect(() => {
    const isFieldDirty = (field: keyof T) => {
      return (
        JSON.stringify(state[field]) !== JSON.stringify(initialState[field])
      );
    };

    const dirtyFields = Object.keys(state).filter(
      (field: keyof T) => !ignoreFields?.includes(field) && isFieldDirty(field),
    );

    setIsDirty(dirtyFields.length > 0);
  }, [initialState, state, ignoreFields]);

  useEffect(() => {
    if (syncOnUpdate) {
      const prevData = prevDataRef.current;

      let hasRelevantChange = true;

      if (prevData) {
        hasRelevantChange = Object.keys(initialState).some((key) => {
          if (ignoreFields?.includes(key)) {
            return false;
          }
          return initialState[key] !== prevData[key];
        });
      }

      if (hasRelevantChange) {
        setState(initialState);
      }

      prevDataRef.current = initialState;
    }
  }, [initialState, syncOnUpdate]);

  const onChange: OnChangeFunction<T> = useCallback((value, field) => {
    setState((prev) => ({ ...prev, [field]: value }));
  }, []);

  const reset = useCallback(() => {
    setState(initialState);
  }, [initialState]);

  const onSubmit: OnSubmitFunction<any> = useCallback(
    (values, params) => {
      if (fetcher.state === "idle") {
        fetcher.submit(values, {
          method: params?.methodType || "POST",
          encType: params?.encType || "application/x-www-form-urlencoded",
        });
      }
    },
    [fetcher],
  );

  return {
    state,
    initialState,
    data: fetcher.data,
    isLoading: fetcher.state === "loading" || fetcher.state === "submitting",
    onChange,
    onSubmit,
    isDirty,
    reset,
  };
};

export default useFormState;
