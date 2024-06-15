import React, { FormEvent, useCallback, useContext } from "react";
import Input from "~/components/Input/Input";
import FileUpload from "~/components/FileUpload/FileUpload";
import TinymceEditor from "~/components/TinymceEditor/TinymceEditor";
import TagsInput from "~/components/Input/TagsInput";
import Button from "~/components/Button/Button";
import { PostFormContext } from "~/contexts/PostContext";
import { Form as RemixForm } from "@remix-run/react";
import Modal from "~/components/Modal/Modal";
import Tooltip from "~/components/Tooltip/Tooltip";
import useModal from "~/hooks/useModal";

const Form = () => {
  const {
    isLoading,
    extras, onChange, onSubmit, values, errors
  } = useContext(PostFormContext);

  const { isOpened, handleToggleModal } = useModal({});

  const onSubmitFunction = useCallback((event: FormEvent<HTMLFormElement> | null, action?: "soft_delete" | "delete") => {
    event?.preventDefault();
    onSubmit(event, action);
  }, [onSubmit]);

  const handleSoftDelete = useCallback(() => {
    handleToggleModal();
    onSubmitFunction(null, "soft_delete");
  }, [onSubmitFunction, handleToggleModal]);

  const handeDelete = useCallback(() => {
    handleToggleModal();
    onSubmitFunction(null, "delete");
  }, [onSubmitFunction, handleToggleModal]);

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

      <div className="flex justify-between items-center mt-10">
        <Button
          formMethod={"delete"}
          variant={"destructive"}
          onClick={handleToggleModal}
          disabled={isLoading}
        >
          Delete
        </Button>
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
      <Modal isLoading={isLoading}
             open={isOpened}
             onClose={handleToggleModal}
             title={"Deletion modal"}
             actions={[
               {
                 text: "Delete soft",
                 onAction: handleSoftDelete,
                 buttonType: "destructive"
               },
               {
                 text: "Delete permanently",
                 onAction: handeDelete,
                 buttonType: "destructive"
               }
             ]}>
        <p>Select please which method of deletion you are prefer: <Tooltip
          tooltip={"The post will be deleted permanently"}><b>default delete</b></Tooltip> or <Tooltip
          tooltip={"The post will not be available to users, but you can restore it at any time"}><b>soft
          delete</b></Tooltip>
        </p>
      </Modal>
    </RemixForm>
  );
};

export default Form;