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
import AwsService from "~/services/aws.service";
import Spinner from "~/components/Spinner/Spinner";
import Input from "~/components/Input/Input";
import TinymceEditor from "~/components/TinymceEditor/TinymceEditor";
import Button from "~/components/Button/Button";
import useFormLoading from "~/hooks/useFormLoading";
import FileUpload from "~/components/FileUpload/FileUpload";
import TagsInput from "~/components/Input/TagsInput";
import { useEffect } from "react";
import { useToast } from "~/hooks/useToast";

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

export default function PostDetailsPage() {
  const actionData = useActionData<typeof action>();
  const data = useLoaderData<typeof loader>();
  const {addToast} = useToast();

  const navigation = useNavigation();
  const isLoading = useFormLoading();
  const isFetchingContent = navigation.state === "loading"
    && navigation.formMethod !== "POST";

  const post = actionData?.updatedPost || data.post;

  useEffect(() => {
    if(actionData?.updatedPost){
      addToast({variant: 'success', message: 'Post updated successfully'});
    }
  }, [actionData]);

  if (isFetchingContent) {
    return (
      <Spinner size={"medium"} />
    );
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
        <Input
          name={"title"}
          inputSettings={{ variant: "input" }}
          label={"Title"}
          id={"title"}
          error={actionData?.errors?.title}
          initialValue={post?.title}
        />

        <FileUpload
          name={"file"}
          id={"file"}
          label={"Photo"}
          error={actionData?.errors?.file}
          initialValue={post?.image?.url}
          placeholder={"Select your photo"}
        />

        <TinymceEditor
          name={"body"}
          initialValue={post?.body}
          error={actionData?.errors?.body}
        />

        <TagsInput
          id={"tags"}
          error={actionData?.errors?.tags}
          initialValue={post.tagPost}
          name={"tags"}
          label={"Tags"}
        />

        <div className="flex justify-between items-center mt-10">
          <Button
            formMethod={"delete"}
            variant={"destructive"}
            disabled={isLoading}
            isSubmit
          >
            Delete
          </Button>
          <Button
            formMethod={"post"}
            variant={"primary"}
            loading={isLoading}
            isSubmit
          >
            Save
          </Button>
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
    return <div>Post not found</div>;
  }

  return <div>An unexpected error occurred: {error.statusText}</div>;
}
