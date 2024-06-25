import { DisplayOn, MixinType, PageType } from "@prisma/client";
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

import { createMixin } from "~/models/mixin.server";
import { getPostListItems } from "~/models/posts.server";
import AwsService from "~/services/aws.service";
import { requireUserId } from "~/session.server";
import { isEmpty, isRegex, isURL } from "~/utils";


export const action = async ({ request }: ActionFunctionArgs) => {
  await requireUserId(request);

  const url = new URL(request.url);

  if (url.searchParams.get("fetch_post")) {
    const query = url.searchParams.get("query");
    const sort = "asc";

    return { postListItems: await getPostListItems({ sort, query }) };
  }

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

  const name = formData.get("name") as string;
  const link = formData.get("link") as string;
  const type = formData.get("type") as string;
  const text = formData.get("text") as string;
  const textForLink = formData.get("textForLink") as string;
  const image = formData.get("image");
  const displayOn = formData.get("displayOn") as string;
  const pageType = formData.get("pageType") as string;
  const priority = formData.get("priority") as string;
  const regex = formData.get("regex") as string;
  const postId = formData.get("postId") as string;

  const isDraft = formData.get("draft");

  let errors = {};

  if (isEmpty(name)) {
    errors = { ...errors, name: "Name is required" };
  }

  if (isEmpty(type)) {
    errors = { ...errors, type: "Type is required" };
  }

  if (!isEmpty(type) && !MixinType[type]) {
    errors = { ...errors, type: "Type is incorrect" };
  }

  if (isEmpty(displayOn) && !isDraft) {
    errors = { ...errors, displayOn: "DisplayOn is required" };
  }

  if (!isEmpty(displayOn) && !DisplayOn[displayOn]) {
    errors = { ...errors, displayOn: "DisplayOn is incorrect" };
  }

  if (isEmpty(pageType) && !isDraft) {
    errors = { ...errors, pageType: "Page type is required" };
  }

  if (!isEmpty(pageType) && !PageType[pageType]) {
    errors = { ...errors, pageType: "Page type is incorrect" };
  }

  if (!isEmpty(link) && !isURL(link)) {
    errors = { ...errors, link: "Incorrect URL" };
  }

  if (!isEmpty(regex) && !isRegex(regex)) {
    errors = { ...errors, regex: "Incorrect Regex" };
  }

  const priorityInt = Number(priority);

  if (!isEmpty(priority) && isNaN(priorityInt)) {
    errors = { ...errors, priority: "Incorrect priority" };
  }

  if (
    !isEmpty(priority) &&
    !isNaN(priorityInt) &&
    (priorityInt < 0 || priorityInt > 100)
  ) {
    errors = { ...errors, priority: "Incorrect priority. Max - 100, Min - 0" };
  }

  if (
    MixinType[type] === "IMAGE" &&
    (!image || image !== "string") &&
    !isDraft
  ) {
    errors = { ...errors, image: "Image is required" };
  }

  if (MixinType[type] === "TEXT" && isEmpty(text) && !isDraft) {
    errors = { ...errors, text: "Text is required" };
  }

  if (MixinType[type] === "POST" && isEmpty(postId) && !isDraft) {
    errors = { ...errors, postId: "Post ID is required" };
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

  const mixin = await createMixin(
    {
      name,
      image: image as string,
      pageType: pageType === "null" ? null : (pageType as PageType),
      displayOn: displayOn === "null" ? null : (displayOn as DisplayOn),
      postId: postId === "null" ? null : postId,
      type: type as MixinType,
      text,
      textForLink,
      regex,
      priority: priorityInt,
      link,
    },
    !!isDraft,
  );

  return redirect(`/admin/mixin/${mixin.id}`);
};
