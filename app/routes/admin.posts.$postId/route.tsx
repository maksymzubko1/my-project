import {
  isRouteErrorResponse, ShouldRevalidateFunctionArgs,
  useLoaderData, useNavigation,
  useRouteError
} from "@remix-run/react";

import { useToast } from "~/hooks/useToast";
import useFormState from "~/hooks/useFormState";
import { PostFormContext, PostFormState } from "~/contexts/PostContext";
import Form from "~/routes/admin.posts.$postId/form";
import { useCallback } from "react";
import Spinner from "~/components/Spinner/Spinner";

import {loader as routeLoader} from "./loader";
import {action as routeAction} from "./action";

export const loader = routeLoader;
export const action = routeAction;

export function shouldRevalidate({
                                   defaultShouldRevalidate,
                                   actionResult
                                 }: ShouldRevalidateFunctionArgs) {
  if (actionResult?.errors || actionResult?.status === "error") {
    return false;
  }
  return defaultShouldRevalidate;
}

export default function PostDetailsPage() {
  const { post } = useLoaderData<typeof loader>();

  const navigation = useNavigation();

  const {
    state,
    initialState,
    data,
    isLoading,
    onChange,
    onSubmit,
    isDirty,
    reset
  } = useFormState<PostFormState>(post, {
    ignoreFields: ["localFile", "status"],
    syncOnUpdate: true
  });

  useToast(data);

  const onSubmitFunction = useCallback((_, action?: string) => {
    const formData = new FormData();

    if (action && (action === "delete" || action === "soft_delete")) {
      formData.set("action", action);
    } else {
      formData.set("action", "edit");
      Object.entries(state).forEach(([key, value]) => {
        if (key === "image") {
          formData.set(key, value as Blob);
        } else {
          formData.set(key, value as string);
        }
      });
    }

    onSubmit(formData, { encType: "multipart/form-data" });
  }, [state]);

  if(navigation.state === "loading"){
    return (
      <Spinner size={"large"} />
    )
  }

  return (
    <div>
      <PostFormContext.Provider value={{
        isLoading,
        onSubmit: onSubmitFunction,
        values: state,
        extras: { isDirty },
        errors: data?.errors,
        onChange
      }}>
        {state.status === "DRAFTED" && <h2 className="w-full font-bold text-3xl mb-3">
          Drafted
        </h2>}
        <Form />
      </PostFormContext.Provider>
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
    return <div>Post not found</div>;
  }

  return <div>An unexpected error occurred: {error.statusText}</div>;
}
