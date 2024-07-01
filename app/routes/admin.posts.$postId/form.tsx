import { Form as RemixForm } from "@remix-run/react";
import { FormEvent, useCallback, useContext } from "react";

import Button from "~/components/Button/Button";
import FileUpload from "~/components/FileUpload/FileUpload";
import Input from "~/components/Input/Input";
import TagsInput from "~/components/Input/TagsInput";
import TinymceEditor from "~/components/TinymceEditor/TinymceEditor";
import { PostFormContext } from "~/contexts/PostContext";

const Form = () => {
  const { isLoading, extras, onChange, onSubmit, values, errors } =
    useContext(PostFormContext);

  const onSubmitFunction = useCallback(
    (event: FormEvent<HTMLFormElement> | null) => {
      event?.preventDefault();
      onSubmit(event);
    },
    [onSubmit],
  );

  return (
    <RemixForm
      onSubmit={onSubmitFunction}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 8,
        width: "100%",
        height: "100%",
      }}
    >
      <Input
        name={"title"}
        inputSettings={{ variant: "input" }}
        label={"Title"}
        id={"title"}
        error={errors?.title}
        value={values.title}
        onChange={(value) => onChange(value, "title")}
      />

      <FileUpload
        name={"file"}
        id={"file"}
        label={"Photo"}
        error={errors?.image}
        onChange={(value) => onChange(value, "image")}
        value={values.image}
        tooltip={"This image will be used like cover image"}
        placeholder={"Select your photo"}
      />

      <TinymceEditor
        name={"body"}
        label={"Post content"}
        error={errors?.body}
        value={values.body}
        onChange={(value) => onChange(value, "body")}
      />

      <Input
        name={"description"}
        inputSettings={{ variant: "textarea" }}
        label={"Description"}
        id={"description"}
        error={errors?.description}
        tooltip={
          "A short description of the post that will be shown in the preview to users"
        }
        value={values.description}
        onChange={(value) => onChange(value, "description")}
      />

      <TagsInput
        id={"tags"}
        error={errors?.tags}
        name={"tags"}
        label={"Tags"}
        value={values.tags}
        onChange={(value) => onChange(value, "tags")}
      />

      <div className="flex justify-end items-center mt-10 pb-10">
        <Button
          formMethod={"post"}
          variant={"primary"}
          disabled={!extras?.isDirty}
          loading={isLoading}
          isSubmit
        >
          Save
        </Button>
      </div>
    </RemixForm>
  );
};

export default Form;
