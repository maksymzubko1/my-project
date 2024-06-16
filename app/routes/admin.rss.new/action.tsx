import { Prisma } from ".prisma/client";
import type { ActionFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";

import { createRssSource, Interval } from "~/models/rss.server";
import RssService from "~/services/rss.service";
import { requireUserId } from "~/session.server";
import { isEmpty } from "~/utils";

import JsonObject = Prisma.JsonObject;

export const action = async ({ request }: ActionFunctionArgs) => {
  await requireUserId(request);

  const formData = await request.formData();

  const name = formData.get("name") as string;
  const tags = formData.get("stopTags") as string;
  const source = formData.get("source") as string;
  const action = formData.get("action") as string;
  const interval = formData.get("interval") as string;
  let fieldMatching: string | JsonObject = formData.get(
    "fieldMatching",
  ) as string;

  let errors = {};

  if (source.length === 0) {
    errors = { ...errors, source: "Source URL is required" };
  }

  if (fieldMatching.length === 0) {
    errors = { ...errors, fieldMatching: "Field matching is required" };
  }

  try {
    fieldMatching = JSON.parse(fieldMatching) as JsonObject;

    const incorrectJson = Object.entries(fieldMatching).some(
      ([key, value]: [string, string]) =>
        !key || key.length === 0 || !value || value.length === 0,
    );
    if (incorrectJson) {
      errors = { ...errors, fieldMatching: "Field matching incorrect" };
    }
  } catch (e) {
    console.log("failed to parse fieldMatching", e);
    errors = { ...errors, fieldMatching: "Field matching incorrect" };
  }

  if (action === "fetch_rss") {
    try {
      const { keys } = await RssService.isValidRss(source as string);
      return json({
        rssResult: {
          keys,
          defaultFieldMatching: {
            body: "content",
            description: "description",
          },
        },
      });
    } catch (e) {
      console.log("fetch_rss error", e.message);
      errors = { ...errors, source: "Failed to fetch source" };
    }
  }

  if (name.length === 0) {
    errors = { ...errors, name: "Title is required" };
  }

  const tagsList =
    tags.length > 0 ? tags.split(",").map((tag) => tag.trim()) : [];

  if (!Interval[interval]) {
    errors = { ...errors, interval: "Incorrect interval value" };
  }

  if (!isEmpty(errors)) {
    return json({ status: "error", errors }, { status: 400 });
  }

  const rss = await createRssSource({
    source,
    stopTags: tagsList,
    fieldMatching: fieldMatching as JsonObject,
    name,
    interval: Interval[interval],
  });

  return redirect(`/admin/rss/${rss.id}`);
};
