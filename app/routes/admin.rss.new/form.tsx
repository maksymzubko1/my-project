import { Form as RemixForm } from "@remix-run/react";
import { FormEvent, useCallback, useContext } from "react";

import Button from "~/components/Button/Button";
import FieldMatching from "~/components/FieldMatching";
import Input from "~/components/Input/Input";
import TagsInput from "~/components/Input/TagsInput";
import Select from "~/components/Select";
import { RSSFormContext } from "~/contexts/RSSContext";
import { intervalOptions } from "~/routes/admin.rss.new/utils";

const Form = () => {
  const { isLoading, extras, onChange, onSubmit, values, errors } =
    useContext(RSSFormContext);

  const onSubmitFunction = useCallback(
    (
      event: FormEvent<HTMLFormElement> | null,
      action?: "fetch_rss" | "create",
    ) => {
      event?.preventDefault();
      onSubmit(event, action);
    },
    [onSubmit],
  );

  const fetchRss = useCallback(() => {
    onSubmitFunction(null, "fetch_rss");
  }, [onSubmitFunction]);

  return (
    <RemixForm
      onSubmit={onSubmitFunction}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 8,
        width: "100%",
      }}
    >
      <div className={"flex flex-col gap-3 items-start"}>
        <Input
          fullWidth
          name={"source"}
          inputSettings={{ variant: "input" }}
          label={"Source"}
          placeholder={"Enter source URL"}
          id={"source"}
          error={errors?.source}
          value={values.source}
          onChange={(value) => onChange(value, "source")}
        />
        <Button loading={isLoading} onClick={fetchRss} variant={"primary"}>
          Fetch
        </Button>
      </div>

      {values.keys && !errors?.source ? (
        <>
          <FieldMatching
            error={errors?.fieldMatching}
            label={"Field matching"}
            onChange={(value) => onChange(value, "fieldMatching")}
            availableKeys={values.keys}
            fields={values.fieldMatching}
          />

          <Input
            name={"name"}
            inputSettings={{ variant: "input" }}
            label={"Name"}
            placeholder={"Enter name of RSS"}
            id={"name"}
            error={errors?.name}
            value={values.name}
            onChange={(value) => onChange(value, "name")}
          />

          <Select
            name={"interval"}
            disableFilter
            error={errors?.interval}
            label={"Fetch interval"}
            items={intervalOptions}
            placeholder={"Select interval"}
            value={values.interval as string}
            onChange={(value) => onChange(value, "interval")}
          />

          <TagsInput
            id={"stopTags"}
            error={errors?.stopTags}
            name={"stopTags"}
            label={"Stop tags"}
            value={values.stopTags}
            onChange={(value) => onChange(value, "stopTags")}
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
        </>
      ) : null}
    </RemixForm>
  );
};

export default Form;
