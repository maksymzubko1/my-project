import type { ActionFunctionArgs, LoaderFunctionArgs, MemoryUploadHandlerFilterArgs } from "@remix-run/node";
import {
  json,
  redirect,
  unstable_composeUploadHandlers,
  unstable_createMemoryUploadHandler,
  unstable_parseMultipartFormData
} from "@remix-run/node";
import {
  Form,
  isRouteErrorResponse, useActionData,
  useLoaderData, useNavigation,
  useRouteError
} from "@remix-run/react";
import invariant from "tiny-invariant";

import { deletePost, getPost, updatePost } from "~/models/posts.server";
import { requireUserId } from "~/session.server";
import { useEffect, useRef } from "react";
import AwsService from "~/services/aws.service";
import Spinner from "~/components/Spinner/Spinner";

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
  const userId = await requireUserId(request);
  invariant(params.postId, "postId not found");

  const post = await getPost({ id: params.postId });
  if (!post) {
    throw new Response("Not Found", { status: 404 });
  }
  return json({ post });
};

export const action = async ({ params, request }: ActionFunctionArgs) => {
  const userId = await requireUserId(request);
  invariant(params.postId, "postId not found");

  const post = await getPost({ id: params.postId });

  if (!post) {
    return json({ error: "Not found post" }, { status: 404 });
  }

  if (request.method === "delete") {
    await deletePost({ id: params.postId });

    return redirect("/admin/posts");
  } else {
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

    const updatedPost = await updatePost(params.postId, {
      body, title, image: uploadedFile, tags: tagsList
    });

    return { updatedPost };
  }
};

export default function NoteDetailsPage() {
  const actionData = useActionData<typeof action>();
  const data = useLoaderData<typeof loader>();

  const navigation = useNavigation();
  const isLoading = ["loading", "submitting"].includes(navigation.state);
  const isFetchingContent = navigation.state === "loading"
    && navigation.formMethod !== "POST";

  const titleEditRef = useRef<HTMLInputElement>(null);
  const bodyEditRef = useRef<HTMLTextAreaElement>(null);
  const photoEditRef = useRef<HTMLInputElement>(null);
  const tagsEditRef = useRef<HTMLTextAreaElement>(null);

  const post = actionData?.updatedPost || data.post;

  useEffect(() => {
    if (actionData?.errors?.title) {
      titleEditRef.current?.focus();
    } else if (actionData?.errors?.body) {
      bodyEditRef.current?.focus();
    } else if (actionData?.errors?.file) {
      photoEditRef.current?.focus();
    } else if (actionData?.errors?.tags) {
      tagsEditRef.current?.focus();
    }
  }, [actionData]);

  if(isFetchingContent){
    return (
      <Spinner/>
    )
  }

  return (
    <div>
      <Form encType={"multipart/form-data"}
            method="post"
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 8,
              width: "100%"
            }}>
        <div>
          <label className="flex w-full flex-col gap-1">
            <span>Title: </span>
            <input
              defaultValue={post.title}
              ref={titleEditRef}
              name="title"
              className="flex-1 rounded-md border-2 border-blue-500 px-3 text-lg leading-loose"
              aria-invalid={actionData?.errors?.title ? true : undefined}
              aria-errormessage={
                actionData?.errors?.title ? "title-error" : undefined
              }
            />
          </label>
          {actionData?.errors?.title ? (
            <div className="pt-1 text-red-700" id="title-error">
              {actionData.errors.title}
            </div>
          ) : null}
        </div>

        <div>
          <label className="flex w-full flex-col gap-1">
            <span>Photo: </span>
            <input
              ref={photoEditRef}
              name="file"
              className="flex-1 rounded-md border-2 border-blue-500 px-3 text-lg leading-loose"
              aria-invalid={actionData?.errors?.file ? true : undefined}
              aria-errormessage={
                actionData?.errors?.file ? "file-error" : undefined
              }
              type="file"
              accept="image/png, image/jpeg, image/jpg"
            />
          </label>
          {actionData?.errors?.file ? (
            <div className="pt-1 text-red-700" id="file-error">
              {actionData.errors.file}
            </div>
          ) : null}
        </div>

        <div>
          <label className="flex w-full flex-col gap-1">
            <span>Body: </span>
            <textarea
              defaultValue={post.body}
              ref={bodyEditRef}
              name="body"
              rows={8}
              className="w-full flex-1 rounded-md border-2 border-blue-500 px-3 py-2 text-lg leading-6"
              aria-invalid={actionData?.errors?.body ? true : undefined}
              aria-errormessage={
                actionData?.errors?.body ? "body-error" : undefined
              }
            />
          </label>
          {actionData?.errors?.body ? (
            <div className="pt-1 text-red-700" id="body-error">
              {actionData.errors.body}
            </div>
          ) : null}
        </div>

        <div>
          <label className="flex w-full flex-col gap-1">
            <span>Tags: </span>
            <textarea
              ref={tagsEditRef}
              name="tags"
              rows={3}
              defaultValue={post.tagPost.map(_tag => _tag.tag.name).join(", ")}
              className="w-full flex-1 rounded-md border-2 border-blue-500 px-3 py-2 text-lg leading-6"
              aria-invalid={actionData?.errors?.tags ? true : undefined}
              aria-errormessage={
                actionData?.errors?.tags ? "tags-error" : undefined
              }
            />
          </label>
          {actionData?.errors?.tags ? (
            <div className="pt-1 text-red-700" id="tags-error">
              {actionData.errors.tags}
            </div>
          ) : null}
        </div>

        <div className="flex justify-between items-center">
          <button
            disabled={isLoading}
            type="submit"
            formMethod={"delete"}
            className="rounded bg-red-500 px-4 py-2 text-white hover:bg-red-400 disabled:opacity-25"
          >
            Delete
          </button>

          <button
            disabled={isLoading}
            type="submit"
            formMethod={"post"}
            className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-r disabled:opacity-25"
          >
            Save
          </button>
        </div>
      </Form>
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
    return <div>Note not found</div>;
  }

  return <div>An unexpected error occurred: {error.statusText}</div>;
}
