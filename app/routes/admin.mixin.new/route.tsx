import type { MetaFunction } from "@remix-run/node";
import { ShouldRevalidateFunctionArgs, useLoaderData } from "@remix-run/react";
import { useCallback } from "react";

import { MixinFormContext, MixinFormState } from "~/contexts/MixinContext";
import useFormState from "~/hooks/useFormState";
import { useToast } from "~/hooks/useToast";
import Form from "~/routes/admin.mixin.new/form";

export const meta: MetaFunction = () => [{ title: "Admin - New mixin" }];

import { action as routeAction } from "./action";
import { loader as routeLoader } from "./loader";

export const loader = routeLoader;
export const action = routeAction;

export function shouldRevalidate({
  defaultShouldRevalidate,
  actionResult,
}: ShouldRevalidateFunctionArgs) {
  if (actionResult?.errors || actionResult?.postListItems) {
    return false;
  }
  return defaultShouldRevalidate;
}

export default function NewMixinPage() {
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
