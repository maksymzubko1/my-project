import type {
  ActionFunctionArgs,
  MemoryUploadHandlerFilterArgs,
} from "@remix-run/node";
import {
  json,
  unstable_composeUploadHandlers,
  unstable_parseMultipartFormData,
} from "@remix-run/node";
import invariant from "tiny-invariant";

import { getPost, updatePost } from "~/models/posts.server";
import AwsService from "~/services/aws.service";
import { requireUserId } from "~/session.server";
import { createCustomMemoryUploadHandler, isEmpty } from "~/utils";

export const action = async ({ params, request }: ActionFunctionArgs) => {
  await requireUserId(request);
  invariant(params.postId, "postId not found");

  const post = await getPost({ id: params.postId });

  if (!post) {
    return json(
      { status: "error", message: "Not found post" },
      { status: 404 },
    );
  }

  const uploadHandler = unstable_composeUploadHandlers(
    createCustomMemoryUploadHandler({
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

  const title = (formData.get("title") as string).trim();
  const body = (formData.get("body") as string).trim();
  const description = (formData.get("description") as string).trim();
  const image = formData.get("image");
  const tags = (formData.get("tags") as string).trim();

  let errors = {};

  if (title?.length === 0) {
    errors = { ...errors, title: "Title is required" };
  }

  if (title?.length > 160) {
    errors = { ...errors, title: "Max title length - 160" };
  }

  if (body?.length === 0) {
    errors = { ...errors, body: "Body is required" };
  }

  if (description?.length === 0) {
    errors = { ...errors, description: "Description is required" };
  }

  if (description?.length > 400) {
    errors = { ...errors, description: "Max description length - 400" };
  }

  if (tags?.length === 0) {
    errors = { ...errors, tags: "Tags is required" };
  }

  const tagsList: string[] = tags?.split(",").map((tag) => tag.trim()) || [];

  if (tagsList?.length === 0) {
    errors = { ...errors, tags: "Minimum 1 tag required" };
  }

  if (tagsList?.length > 15) {
    errors = { ...errors, tags: "Max tags count - 15" };
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

  const updatedPost = await updatePost(params.postId, {
    body,
    title,
    image: {
      remove: image === "null",
      url: uploadedFile,
    },
    tags: tagsList,
    description,
  });

  return {
    status: "success",
    updatedPost,
    message: "Post successfully updated",
  };
};
