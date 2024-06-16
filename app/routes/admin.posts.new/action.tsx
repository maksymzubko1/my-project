import type {
  ActionFunctionArgs,
  MemoryUploadHandlerFilterArgs,
} from "@remix-run/node";
import {
  json,
  redirect,
  unstable_composeUploadHandlers,
  unstable_createMemoryUploadHandler,
  unstable_parseMultipartFormData,
} from "@remix-run/node";

import { createPost } from "~/models/posts.server";
import AwsService from "~/services/aws.service";
import { requireUserId } from "~/session.server";
import { isEmpty } from "~/utils";

export const action = async ({ request }: ActionFunctionArgs) => {
  await requireUserId(request);

  const uploadHandler = unstable_composeUploadHandlers(
    unstable_createMemoryUploadHandler({
      filter(args: MemoryUploadHandlerFilterArgs): boolean | Promise<boolean> {
        if (args.contentType) {
          return ["image/png", "image/jpeg", "image/jpg"].includes(
            args.contentType.toLowerCase(),
          );
        }
        return true;
      },
      maxPartSize: 3000000,
    }),
  );

  const formData = await unstable_parseMultipartFormData(
    request,
    uploadHandler,
  );

  const title = formData.get("title") as string;
  const body = formData.get("body") as string;
  const description = formData.get("description") as string;
  const image = formData.get("image");
  const tags = formData.get("tags") as string;

  const isDraft = formData.get("draft");

  let errors = {};

  if (title?.length === 0) {
    errors = { ...errors, title: "Title is required" };
  }

  if (body?.length === 0 && !isDraft) {
    errors = { ...errors, body: "Body is required" };
  }

  if (description?.length === 0 && !isDraft) {
    errors = { ...errors, description: "Description is required" };
  }

  if (tags?.length === 0 && !isDraft) {
    errors = { ...errors, tags: "Tags is required" };
  }

  const tagsList: string[] =
    tags.length > 0
      ? tags
          ?.trim()
          ?.split(",")
          .map((tag) => tag.trim())
      : [];

  if (tagsList?.length === 0 && !isDraft) {
    errors = { ...errors, tags: "Minimum 1 tag required" };
  }

  const uploadedFile =
    typeof image !== "string" && image
      ? ((await AwsService.uploadImage(image as File)) as string)
      : undefined;

  if (typeof uploadedFile !== "string" && uploadedFile?.error) {
    errors = { ...errors, image: uploadedFile.error };
  }

  if (!isEmpty(errors)) {
    return json({ status: "error", errors }, { status: 400 });
  }

  const post = await createPost(
    {
      body: body || "",
      title,
      image: uploadedFile,
      tags: tagsList,
      description: description || "",
    },
    !!isDraft,
  );

  return redirect(`/admin/posts/${post.id}`);
};
