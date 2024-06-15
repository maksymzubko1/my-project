import type { ActionFunctionArgs, MemoryUploadHandlerFilterArgs } from "@remix-run/node";
import { requireUserId } from "~/session.server";
import invariant from "tiny-invariant";
import { deletePost, getPost, updatePost } from "~/models/posts.server";
import { json, redirect, unstable_composeUploadHandlers, unstable_parseMultipartFormData } from "@remix-run/node";
import { createCustomMemoryUploadHandler, isEmpty } from "~/utils";
import AwsService from "~/services/aws.service";

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
    const title = formData.get("title") as string;
    const body = formData.get("body") as string;
    const description = formData.get("description") as string;
    const image = formData.get("image");
    const tags = formData.get("tags") as string;

    let errors = {};

    if (title?.length === 0) {
      errors = {...errors, title: "Title is required"}
    }

    if (body?.length === 0) {
      errors = {...errors, body: "Body is required"}
    }

    if (description?.length === 0) {
      errors = {...errors, description: "Description is required"}
    }

    if (tags?.length === 0) {
      errors = {...errors, tags: "Tags is required"}
    }

    const tagsList: string[] = tags?.split(",").map(tag => tag.trim()) || [];

    if (tagsList?.length === 0) {
      errors = {...errors, tags: "Minimum 1 tag required"}
    }

    const uploadedFile = typeof image !== "string" && image
      ? await AwsService.uploadImage(image as File) as string : undefined;

    if (typeof uploadedFile !== "string" && uploadedFile?.error) {
      errors = {...errors, image: uploadedFile.error}
    }

    if(!isEmpty(errors)){
      return json({status: "error", errors}, {status: 400});
    }

    const updatedPost = await updatePost(params.postId, {
      body, title, image: uploadedFile, tags: tagsList, description
    });

    return { status: "success", updatedPost, message: "Post successfully updated" };
  }
};