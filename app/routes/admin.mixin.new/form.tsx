import { Form as RemixForm, useFetcher } from "@remix-run/react";
import { FormEvent, useCallback, useContext, useEffect, useState } from "react";

import Button from "~/components/Button/Button";
import FileUpload from "~/components/FileUpload/FileUpload";
import Input from "~/components/Input/Input";
import PostSelector from "~/components/PostSelector/PostSelector";
import Select from "~/components/Select";
import { MixinFormContext } from "~/contexts/MixinContext";
import {
  mixinDisplayOn,
  mixinPageType,
  mixinTypes
} from "~/routes/admin.mixin.new/utils";

const Form = () => {
  const { isLoading, extras, onChange, onSubmit, values, errors } =
    useContext(MixinFormContext);

  const fetcher = useFetcher();
  const [items, setItems] = useState([]);

  useEffect(() => {
    if (fetcher.data && fetcher.data.postListItems) {
      setItems(fetcher.data.postListItems);
    }
  }, [fetcher]);

  useEffect(() => {
    fetcher.submit({}, { action: `?fetch_post=true&search=`, method: "post" });
  }, []);

  const onSubmitFunction = useCallback(
    (event: FormEvent<HTMLFormElement> | null, action?: "isDraft") => {
      event?.preventDefault();
      onSubmit(event, action);
    },
    [onSubmit]
  );

  const handleClickDraft = useCallback(() => {
    onSubmitFunction(null, "isDraft");
  }, [onSubmitFunction]);

  return (
    <RemixForm
      onSubmit={onSubmitFunction}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 8,
        width: "100%"
      }}
    >
      <Input
        name={"name"}
        inputSettings={{ variant: "input" }}
        label={"Name"}
        id={"name"}
        error={errors?.name}
        value={values.name}
        onChange={(value) => onChange(value, "name")}
      />

      <Select
        disableFilter
        label={"Type"}
        error={errors?.type}
        items={mixinTypes}
        value={values.type}
        onChange={(value) => onChange(value, "type")}
      />

      {values.type === "IMAGE" ? <>
        <FileUpload
          name={"file"}
          id={"file"}
          label={"Image"}
          error={errors?.image}
          initialValue={values.image}
          onChange={(value) => onChange(value, "image")}
          value={values.image}
          placeholder={"Select image"}
        />
        <Input
          name={"linkForImage"}
          inputSettings={{ variant: "input" }}
          label={"Link"}
          id={"link"}
          error={errors?.linkForImage}
          value={values.linkForImage}
          onChange={(value) => onChange(value, "linkForImage")}
        />
      </> : null}

      {values.type === "TEXT" ? <>
        <Input
          name={"text"}
          inputSettings={{ variant: "textarea" }}
          label={"Text"}
          id={"text"}
          error={errors?.text}
          value={values.text}
          onChange={(value) => onChange(value, "text")}
        />
        <Input
          name={"textForLink"}
          inputSettings={{ variant: "input" }}
          label={"Text for link"}
          id={"textForLink"}
          error={errors?.textForLink}
          value={values.textForLink}
          onChange={(value) => onChange(value, "textForLink")}
        />
        <Input
          name={"linkForText"}
          inputSettings={{ variant: "input" }}
          label={"Link"}
          id={"link"}
          error={errors?.linkForText}
          value={values.linkForText}
          onChange={(value) => onChange(value, "linkForText")}
        />
      </> : null}

      {values.type === "POST" ? <PostSelector
        error={errors?.postId}
        value={values.postId}
        items={items}
        onChange={(value) => onChange(value, "postId")}
        isLoading={isLoading}
      /> : null}

      {values.type && values.type !== "" ? <>
        <Select
          error={errors?.displayOn}
          disableFilter
          label={"Display on"}
          items={mixinDisplayOn}
          value={values.displayOn}
          onChange={(value) => onChange(value, "displayOn")}
        />

        {values.displayOn && values.displayOn !== "" && values.displayOn !== "SEARCH" &&
          <>
            <hr className="my-3"/>
            <h4 className="text-gray-700">Settings for <bold>List and Tag</bold> pages</h4>
            <Select
              error={errors?.pageType}
              disableFilter
              label={"Page type"}
              items={mixinPageType}
              value={values.pageType}
              onChange={(value) => onChange(value, "pageType")}
            />
            <Input
              name={"priority"}
              inputSettings={{
                variant: "input",
                type: "number",
                max: 100,
                min: 0
              }}
              label={"Priority"}
              id={"priority"}
              error={errors?.priority}
              value={String(values.priority)}
              onChange={(value) => onChange(value, "priority")}
            />
          </>
        }

        {values.displayOn && values.displayOn && values.displayOn !== "LIST" &&
          <>
            <hr className="my-3" />
            <h4 className="text-gray-700">Settings for <bold>Search</bold> page</h4>
            <Input
              name={"regex"}
              inputSettings={{ variant: "input" }}
              label={"Regex"}
              id={"regex"}
              error={errors?.regex}
              value={values.regex}
              onChange={(value) => onChange(value, "regex")}
            />
          </>}

      </> : null}

      <div className="flex justify-end gap-2 items-center mt-10 pb-10">
        <Button
          formMethod={"post"}
          variant={"primary"}
          disabled={!extras?.isDirty}
          loading={isLoading}
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
