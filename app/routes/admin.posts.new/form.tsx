import React, { FormEvent, useCallback, useContext } from "react";
import Input from "~/components/Input/Input";
import FileUpload from "~/components/FileUpload/FileUpload";
import TinymceEditor from "~/components/TinymceEditor/TinymceEditor";
import TagsInput from "~/components/Input/TagsInput";
import { PostFormContext } from "~/contexts/PostContext";
import { Form as RemixForm } from "@remix-run/react";
import Button from "~/components/Button/Button";

const Form = () => {
  const {
    isLoading,
    extras, onChange, onSubmit, values, errors
  } = useContext(PostFormContext);

  const onSubmitFunction = useCallback((event: FormEvent<HTMLFormElement> | null, action?: "draft") => {
    event?.preventDefault();
    onSubmit(event, action);
  }, [onSubmit]);

  const handleClickDraft = useCallback(() => {
    onSubmitFunction(null, "draft");
  }, [onSubmitFunction]);

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

      <Input
        name={"description"}
        inputSettings={{ variant: "textarea" }}
        label={"Description"}
        id={"description"}
        error={errors?.description}
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

      <div className="flex justify-end gap-2 items-center mt-10">
        <Button
          formMethod={"post"}
          variant="primary"
          disabled={!extras?.isDirty}
          isSubmit
        >
          Save
        </Button>
        <Button
          formMethod={"post"}
          formAction={"draft"}
          variant="secondary-2"
          disabled={!extras?.isDirty}
          onClick={handleClickDraft}
        >
          Save as Draft
        </Button>
      </div>
    </RemixForm>
  );
};

export default Form;