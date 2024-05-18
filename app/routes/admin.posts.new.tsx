import type { ActionFunctionArgs, MemoryUploadHandlerFilterArgs, MetaFunction } from "@remix-run/node";
import {
  json,
  redirect,
  unstable_composeUploadHandlers,
  unstable_createMemoryUploadHandler,
  unstable_parseMultipartFormData
} from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import { useEffect, useRef } from "react";

import { createPost } from "~/models/posts.server";
import { requireUserId } from "~/session.server";
import AwsService from "~/services/aws.service";

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

  if(typeof uploadedFile !== "string" && uploadedFile?.error){
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

export default function NewNotePage() {
  const actionData = useActionData<typeof action>();
  const titleRef = useRef<HTMLInputElement>(null);
  const bodyRef = useRef<HTMLTextAreaElement>(null);
  const photoRef = useRef<HTMLInputElement>(null);
  const tagsRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (actionData?.errors?.title) {
      titleRef.current?.focus();
    } else if (actionData?.errors?.body) {
      bodyRef.current?.focus();
    } else if (actionData?.errors?.file) {
      photoRef.current?.focus();
    } else if (actionData?.errors?.tags) {
      tagsRef.current?.focus();
    }

  }, [actionData]);

  return (
    <Form
      encType={"multipart/form-data"}
      method="post"
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 8,
        width: "100%"
      }}
    >
      <div>
        <label className="flex w-full flex-col gap-1">
          <span>Title: </span>
          <input
            ref={titleRef}
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
            ref={photoRef}
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
            ref={bodyRef}
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
            ref={tagsRef}
            name="tags"
            rows={3}
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

      <div className="text-right">
        <button
          type="submit"
          className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 focus:bg-blue-400"
        >
          Save
        </button>
      </div>
    </Form>
  );
}
