import type { MetaFunction } from "@remix-run/node";
import { ShouldRevalidateFunctionArgs, useLoaderData } from "@remix-run/react";
import { useCallback, useEffect } from "react";

import { RSSFormContext, RSSFormState } from "~/contexts/RSSContext";
import useFormState from "~/hooks/useFormState";
import { useToast } from "~/hooks/useToast";
import Form from "~/routes/admin.rss.new/form";

export const meta: MetaFunction = () => [{ title: "Admin - New Rss source" }];

import { action as routeAction } from "./action";
import { loader as routeLoader } from "./loader";

export const loader = routeLoader;
export const action = routeAction;

export function shouldRevalidate({
  defaultShouldRevalidate,
  actionResult,
}: ShouldRevalidateFunctionArgs) {
  if (actionResult?.rssResult || actionResult?.errors) {
    return false;
  }
  return defaultShouldRevalidate;
}

export default function NewPostPage() {
  const { rss } = useLoaderData<typeof loader>();

  const { state, data, isLoading, onChange, onSubmit, isDirty } =
    useFormState<RSSFormState>(rss, {
      ignoreFields: ["keys"],
      syncOnUpdate: true,
    });

  useToast(data);

  const onSubmitFunction = useCallback(
    (_, action?: string) => {
      const formData = new FormData();

      if (action) {
        formData.set("action", action);
      }

      Object.entries(state).forEach(([key, value]) => {
        if (key === "fieldMatching") {
          formData.set(key, JSON.stringify(value));
        } else {
          formData.set(key, value as string);
        }
      });

      onSubmit(formData, { encType: "multipart/form-data" });
    },
    [state, onSubmit],
  );

  useEffect(() => {
    if (data && data?.rssResult) {
      onChange(data.rssResult.defaultFieldMatching, "fieldMatching");
      onChange(data.rssResult.keys, "keys");
    }
  }, [data, onChange]);

  return (
    <div>
      <RSSFormContext.Provider
        value={{
          isLoading,
          onSubmit: onSubmitFunction,
          values: state,
          extras: { isDirty },
          errors: data?.errors,
          onChange,
        }}
      >
        <Form />
      </RSSFormContext.Provider>
    </div>
  );
}
