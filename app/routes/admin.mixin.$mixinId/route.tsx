import {
  isRouteErrorResponse,
  ShouldRevalidateFunctionArgs,
  useLoaderData,
  useRouteError,
} from "@remix-run/react";
import { useCallback } from "react";

import { MixinFormContext, MixinFormState } from "~/contexts/MixinContext";
import useFormState from "~/hooks/useFormState";
import { useToast } from "~/hooks/useToast";
import Form from "~/routes/admin.mixin.$mixinId/form";

import { action as routeAction } from "./action";
import { loader as routeLoader } from "./loader";

export const loader = routeLoader;
export const action = routeAction;

export function shouldRevalidate({
  defaultShouldRevalidate,
  actionResult,
}: ShouldRevalidateFunctionArgs) {
  if (
    actionResult?.errors ||
    actionResult?.status === "error" ||
    actionResult?.postListItems
  ) {
    return false;
  }
  return defaultShouldRevalidate;
}

export default function MixinDetailsPage() {
  const { mixin } = useLoaderData<typeof loader>();

  const { state, data, isLoading, onChange, onSubmit, isDirty } =
    useFormState<MixinFormState>(mixin, {
      ignoreFields: ["imageId", "post", "localFile"],
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
        if (key === "file") {
          formData.set(key, value as Blob);
        } else {
          formData.set(key, value as string);
        }
      });

      onSubmit(formData, { encType: "multipart/form-data" });
    },
    [state, onSubmit],
  );

  return (
    <div>
      <MixinFormContext.Provider
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
      </MixinFormContext.Provider>
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
    return <div>Mixin not found</div>;
  }

  return <div>An unexpected error occurred: {error.statusText}</div>;
}
