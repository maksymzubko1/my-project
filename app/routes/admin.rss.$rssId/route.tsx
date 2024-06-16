import {
  isRouteErrorResponse,
  ShouldRevalidateFunctionArgs,
  useLoaderData,
  useRouteError,
} from "@remix-run/react";
import { useCallback } from "react";

import { RSSFormContext, RSSFormState } from "~/contexts/RSSContext";
import useFormState from "~/hooks/useFormState";
import { useToast } from "~/hooks/useToast";
import Form from "~/routes/admin.rss.$rssId/form";

export function shouldRevalidate({
  defaultShouldRevalidate,
  actionResult,
}: ShouldRevalidateFunctionArgs) {
  if (actionResult?.errors || actionResult?.status === "error") {
    return false;
  }
  return defaultShouldRevalidate;
}

import { action as routeAction } from "./action";
import { loader as routeLoader } from "./loader";

export const loader = routeLoader;
export const action = routeAction;

export default function RSSDetailsPage() {
  const { rss } = useLoaderData<typeof loader>();

  const { state, data, isLoading, onChange, onSubmit, isDirty } =
    useFormState<RSSFormState>(rss, {
      ignoreFields: ["keys"],
      syncOnUpdate: true,
    });

  useToast(data);

  const onSubmitFunction = useCallback(() => {
    const formData = new FormData();

    Object.entries(state).forEach(([key, value]) => {
      if (key === "fieldMatching") {
        formData.set(key, JSON.stringify(value));
      } else {
        formData.set(key, value as string);
      }
    });

    onSubmit(formData, { encType: "multipart/form-data" });
  }, [state, onSubmit]);

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

export function ErrorBoundary() {
  const error = useRouteError();

  if (error instanceof Error) {
    return <div>An unexpected error occurred: {error.message}</div>;
  }

  if (!isRouteErrorResponse(error)) {
    return <h1>Unknown Error</h1>;
  }

  if (error.status === 404) {
    return <div>Rss not found</div>;
  }

  return <div>An unexpected error occurred: {error.statusText}</div>;
}
