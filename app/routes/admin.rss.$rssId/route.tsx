import type { ActionFunctionArgs, LoaderFunctionArgs, MemoryUploadHandlerFilterArgs } from "@remix-run/node";
import {
  json,
  redirect,
  unstable_composeUploadHandlers,
  unstable_parseMultipartFormData
} from "@remix-run/node";
import {
  isRouteErrorResponse,
  useLoaderData,
  useRouteError
} from "@remix-run/react";
import invariant from "tiny-invariant";

import { deletePost, getPost, updatePost } from "~/models/posts.server";
import { requireUserId } from "~/session.server";
import AwsService from "~/services/aws.service";
import { useToast } from "~/hooks/useToast";
import { createCustomMemoryUploadHandler } from "~/utils";
import useModal from "~/hooks/useModal";
import Modal from "~/components/Modal/Modal";
import useFormState from "~/hooks/useFormState";
import { PostFormContext, PostFormState } from "~/contexts/PostContext";
import Form from "~/routes/admin.posts.$postId/form";
import { useCallback } from "react";
import Tooltip from "~/components/Tooltip/Tooltip";

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
  await requireUserId(request);
  invariant(params.postId, "postId not found");

  const post = await getPost({ id: params.postId });

  if (!post) {
    throw new Response("Not Found", { status: 404 });
  }

  const tags = post.tagPost.map(tag => tag.tag.name);
  return json({ post: { title: post.title, body: post.body, tags, image: post?.image?.url } });
};

export const action = async ({ params, request }: ActionFunctionArgs) => {
  await requireUserId(request);
  invariant(params.postId, "postId not found");

  const post = await getPost({ id: params.postId });

  if (!post) {
    return json({ status: "error", message: "Not found post" }, { status: 404 });
  }

  const uploadHandler = unstable_composeUploadHandlers(
    createCustomMemoryUploadHandler({
      filter(args: MemoryUploadHandlerFilterArgs): boolean | Promise<boolean> {
        if (args.contentType) {
          return ["image/png", "image/jpeg", "image/jpg"].includes(args.contentType.toLowerCase());
        }
        return true;
      },
      maxPartSize: 3000000
    })
  );

  const formData = await unstable_parseMultipartFormData(
    request,
    uploadHandler
  );

  const action = formData.get("action");

  if (action === "delete") {
    await deletePost({ id: params.postId });

    return redirect("/admin/posts");
  } else if (action === "soft_delete") {
    //   TODO: soft delete
    return json({ status: "success", message: "Post was successfully soft deleted" });
  } else {
    const title = formData.get("title");
    const body = formData.get("body");
    const image = formData.get("file");
    const tags = formData.get("tags");

    if (typeof title !== "string" || title.length === 0) {
      return json(
        { status: "error", errors: { body: null, title: "Title is required", file: null, tags: null } },
        { status: 400 }
      );
    }

    if (typeof body !== "string" || body.length === 0) {
      return json(
        { status: "error", errors: { body: "Body is required", title: null, file: null, tags: null } },
        { status: 400 }
      );
    }

    if (typeof image === "string") {
      return json(
        { status: "error", errors: { file: image, body: null, title: null, tags: null } },
        { status: 400 }
      );
    }

    if (typeof tags !== "string" || tags.length === 0) {
      return json(
        { status: "error", errors: { tags: "Tags is required", title: null, file: null, body: null } },
        { status: 400 }
      );
    }

    const tagsList = tags.split(",").map(tag => tag.trim());

    if (tagsList.length === 0) {
      return json(
        { status: "error", errors: { tags: "Minimum 1 tag required", title: null, file: null, body: null } },
        { status: 400 }
      );
    }

    const uploadedFile = image
      ? await AwsService.uploadImage(image) as string : undefined;

    if (typeof uploadedFile !== "string" && uploadedFile?.error) {
      return json(
        { status: "error", errors: { file: uploadedFile.error, title: null, tags: null, body: null } },
        { status: 400 }
      );
    }

    const updatedPost = await updatePost(params.postId, {
      body, title, image: uploadedFile, tags: tagsList
    });

    return { status: "success", updatedPost, message: "Post successfully updated" };
  }
};

export default function PostDetailsPage() {
  const { post } = useLoaderData<typeof loader>();

  const {
    state,
    initialState,
    data,
    isLoading,
    onChange,
    onSubmit,
    isDirty,
    reset
  } = useFormState<PostFormState>({ ...post, image: post.image, localFile: null }, {
    ignoreFields: ["localFile"],
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
        if (key === "file") {
          formData.set(key, value as Blob);
        } else {
          formData.set(key, value as string);
        }
      });
    }

    onSubmit(formData, { encType: "multipart/form-data" });
  }, [state]);

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
