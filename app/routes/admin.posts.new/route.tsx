import type { MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { useCallback } from "react";

import { PostFormContext, PostFormState } from "~/contexts/PostContext";
import useFormState from "~/hooks/useFormState";
import { useToast } from "~/hooks/useToast";
import Form from "~/routes/admin.posts.new/form";

export const meta: MetaFunction = () => [{ title: "Admin - New Post" }];

import { action as routeAction } from "./action";
import { loader as routeLoader } from "./loader";

export const loader = routeLoader;
export const action = routeAction;

export default function NewPostPage() {
  const { post } = useLoaderData<typeof loader>();

  const { state, data, isLoading, onChange, onSubmit, isDirty } =
    useFormState<PostFormState>(post, {
      ignoreFields: ["localFile"],
    });

  useToast(data);

  const onSubmitFunction = useCallback(
    (_, action?: string) => {
      const formData = new FormData();

      if (action === "draft") {
        formData.set("draft", "enabled");
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
      <PostFormContext.Provider
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
      </PostFormContext.Provider>
    </div>
  );
}
