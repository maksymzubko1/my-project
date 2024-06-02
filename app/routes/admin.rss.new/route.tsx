import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction
} from "@remix-run/node";
import {
  json,
  redirect
} from "@remix-run/node";

import { requireUserId } from "~/session.server";
import useFormState from "~/hooks/useFormState";
import { useToast } from "~/hooks/useToast";
import { useCallback, useEffect } from "react";
import Form from "~/routes/admin.rss.new/form";
import { ShouldRevalidateFunctionArgs, useLoaderData } from "@remix-run/react";
import { RSSFormContext, RSSFormState } from "~/contexts/RSSContext";
import RssService from "~/services/rss.service";

export const meta: MetaFunction = () => [{ title: "Admin - New Rss source" }];

export function shouldRevalidate({
                                   defaultShouldRevalidate,
                                   actionResult
                                 }: ShouldRevalidateFunctionArgs) {
  if (actionResult?.rssResult) {
    return false;
  }
  return defaultShouldRevalidate;
}

export const action = async ({ request }: ActionFunctionArgs) => {
  await requireUserId(request);

  const formData = await request.formData();

  const name = formData.get("name");
  const tags = formData.get("stopTags");
  const source = formData.get("source");
  const action = formData.get("action");

  if (typeof source !== "string" || source.length === 0) {
    return json(
      { errors: { stopTags: null, name: null, source: "Source URL is required" } },
      { status: 400 }
    );
  }

  if (action === "fetch_rss") {
    try {
      const { keys } = await RssService.isValidRss(source as string);
      return json({
        rssResult: {
          keys, defaultFieldMatching: {
            body: "content",
            description: "description"
          }
        }
      });
    } catch (e) {
      console.log("fetch_rss error", e.message);
      return json({ errors: { stopTags: null, name: null, source: "Failed to fetch source" } }, { status: 400 });
    }
  }

  if (typeof name !== "string" || name.length === 0) {
    return json(
      { errors: { body: null, title: "Title is required", file: null, tags: null } },
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

  // const post = await createPost({
  //   body, title, image: uploadedFile, tags: tagsList
  // });

  return redirect(`/admin/rss/1`);
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  return {
    rss: {
      name: "",
      source: "",
      interval: "everyMinute",
      stopTags: [] as RSSFormState["stopTags"],
      fieldMatching: {} as RSSFormState["fieldMatching"],
      isPaused: false
    }
  };
};

export default function NewPostPage() {
  const { rss } = useLoaderData<typeof loader>();

  const {
    state,
    data,
    isLoading,
    onChange,
    onSubmit,
    initialState,
    isDirty
  } = useFormState<RSSFormState>(rss, {
    ignoreFields: ['keys'],
    syncOnUpdate: true
  });

  useToast(data);

  const onSubmitFunction = useCallback((_, action?: string) => {
    const formData = new FormData();

    if (action) {
      formData.set("action", action);
    }

    Object.entries(state).forEach(([key, value]) => {
      if (key === "fieldMatching") {
        formData.set(key, JSON.stringify(value));
      } else {
        formData.set(key, value as string);
      }
    });

    onSubmit(formData, { encType: "multipart/form-data" });
  }, [state]);

  useEffect(() => {
    if (data && data?.rssResult) {
      onChange(data.rssResult.defaultFieldMatching, "fieldMatching");
      onChange(data.rssResult.keys, "keys");
    }
  }, [data, onChange]);

  return (
    <div>
      <RSSFormContext.Provider value={{
        isLoading,
        onSubmit: onSubmitFunction,
        values: state,
        extras: { isDirty },
        errors: data?.errors,
        onChange
      }}>
        <Form />
      </RSSFormContext.Provider>
    </div>
  );
}
