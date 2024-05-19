import type { ActionFunctionArgs, MemoryUploadHandlerFilterArgs, MetaFunction } from "@remix-run/node";
import {
  json,
  redirect,
  unstable_composeUploadHandlers,
  unstable_createMemoryUploadHandler,
  unstable_parseMultipartFormData
} from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";

import { createPost } from "~/models/posts.server";
import { requireUserId } from "~/session.server";
import AwsService from "~/services/aws.service";
import Input from "~/components/Input/Input";
import TinymceEditor from "~/components/TinymceEditor/TinymceEditor";
import Button from "~/components/Button/Button";
import useFormLoading from "~/hooks/useFormLoading";
import FileUpload from "~/components/FileUpload/FileUpload";
import TagsInput from "~/components/Input/TagsInput";

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

export default function NewNotePage() {
  const actionData = useActionData<typeof action>();
  const isLoading = useFormLoading();

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
      <Input
        name={"title"}
        inputSettings={{ variant: "input" }}
        label={"Title"}
        id={"title"}
        error={actionData?.errors?.title}
        placeholder={"Enter title"}
      />

      <FileUpload
        name={"file"}
        id={"file"}
        label={"Photo"}
        error={actionData?.errors?.file}
        placeholder={"Select your photo"}
      />

      <TinymceEditor
        name={"body"}
        error={actionData?.errors?.body}
      />

      <TagsInput
        id={"tags"}
        error={actionData?.errors?.tags}
        name={"tags"}
        label={"Tags"}
      />

      <div className="text-right mt-10">
        <Button
          variant={"primary"}
          loading={isLoading}
          isSubmit
        >
          Save
        </Button>
      </div>
    </Form>
  );
}
