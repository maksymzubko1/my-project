import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MemoryUploadHandlerFilterArgs,
  MetaFunction
} from "@remix-run/node";
import {
  json,
  redirect,
  unstable_composeUploadHandlers,
  unstable_createMemoryUploadHandler,
  unstable_parseMultipartFormData
} from "@remix-run/node";

import { createPost } from "~/models/posts.server";
import { requireUserId } from "~/session.server";
import AwsService from "~/services/aws.service";
import useFormState from "~/hooks/useFormState";
import { PostFormContext, PostFormState } from "~/contexts/PostContext";
import { useToast } from "~/hooks/useToast";
import { useCallback } from "react";
import Form from "~/routes/admin.posts.new/form";
import { useLoaderData } from "@remix-run/react";

export const meta: MetaFunction = () => [{ title: "Admin - New Post" }];

export const action = async ({ request }: ActionFunctionArgs) => {
  const userId = await requireUserId(request);

  const uploadHandler = unstable_composeUploadHandlers(
    unstable_createMemoryUploadHandler({
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

  const title = formData.get("title");
  const body = formData.get("body");
  const image = formData.get("file") as File;
  const tags = formData.get("tags");

  if (typeof title !== "string" || title.length === 0) {
    return json(
      { errors: { body: null, title: "Title is required", file: null, tags: null } },
      { status: 400 }
    );
  }

  if (typeof body !== "string" || body.length === 0) {
    return json(
      { errors: { body: "Body is required", title: null, file: null, tags: null } },
      { status: 400 }
    );
  }

  if (typeof tags !== "string" || tags.length === 0) {
    return json(
      { errors: { tags: "Tags is required", title: null, file: null, body: null } },
      { status: 400 }
    );
  }

  const tagsList = tags.split(",").map(tag => tag.trim());

  if (tagsList.length === 0) {
    return json(
      { errors: { tags: "Minimum 1 tag required", title: null, file: null, body: null } },
      { status: 400 }
    );
  }

  const uploadedFile = image
    ? await AwsService.uploadImage(image) as string : undefined;

  if (typeof uploadedFile !== "string" && uploadedFile?.error) {
    return json(
      { errors: { file: uploadedFile.error, title: null, tags: null, body: null } },
      { status: 400 }
    );
  }

  const post = await createPost({
    body, title, image: uploadedFile, tags: tagsList
  });

  return redirect(`/admin/posts/${post.id}`);
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  return {post: { body: "", tags: [] as string[], title: "", image: undefined, localFile: null }}
};

export default function NewPostPage() {
  const {post} = useLoaderData<typeof loader>();

  const {
    state,
    data,
    isLoading,
    onChange,
    onSubmit,
    isDirty
  } = useFormState<PostFormState>({ ...post, localFile: null, image: undefined}, {
    ignoreFields: ["localFile"],
    syncOnUpdate: true
  });

  useToast(data);

  const onSubmitFunction = useCallback((_, action?: string) => {
    const formData = new FormData();

    Object.entries(state).forEach(([key, value]) => {
      if (key === "file") {
        formData.set(key, value as Blob);
      } else {
        formData.set(key, value as string);
      }
    });

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
