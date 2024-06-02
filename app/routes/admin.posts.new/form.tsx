import React, { FormEvent, useCallback, useContext } from "react";
import Input from "~/components/Input/Input";
import FileUpload from "~/components/FileUpload/FileUpload";
import TinymceEditor from "~/components/TinymceEditor/TinymceEditor";
import TagsInput from "~/components/Input/TagsInput";
import Button from "~/components/Button/Button";
import { PostFormContext } from "~/contexts/PostContext";
import { Form as RemixForm } from "@remix-run/react";

const Form = () => {
  const {
    isLoading,
    extras, onChange, onSubmit, values, errors
  } = useContext(PostFormContext);

  const onSubmitFunction = useCallback((event: FormEvent<HTMLFormElement> | null, action?: "soft_delete" | "delete") => {
    event?.preventDefault();
    onSubmit(event, action);
  }, [onSubmit]);

  return (
    <RemixForm
      onSubmit={onSubmitFunction}
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
        placeholder={"Select your photo"}
      />

      <TinymceEditor
        name={"body"}
        error={errors?.body}
        value={values.body}
        onChange={(value) => onChange(value, "body")}
      />

      <TagsInput
        id={"tags"}
        error={errors?.tags}
        name={"tags"}
        label={"Tags"}
        value={values.tags}
        onChange={(value) => onChange(value, "tags")}
      />

      <div className="flex justify-end items-center mt-10">
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