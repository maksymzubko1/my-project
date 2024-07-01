import { Prisma } from ".prisma/client";
import type { ActionFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import invariant from "tiny-invariant";

import { getRssById, Interval, updateRssSource } from "~/models/rss.server";
import { requireUserId } from "~/session.server";
import { isEmpty } from "~/utils";

import JsonObject = Prisma.JsonObject;

export const action = async ({ request, params }: ActionFunctionArgs) => {
  await requireUserId(request);
  invariant(params.rssId, "rssId not found");

  const rss = await getRssById(params.rssId);

  if (!rss) {
    return json({ status: "error", message: "Not found rss" }, { status: 404 });
  }

  const formData = await request.formData();

  const name = (formData.get("name") as string)?.trim();
  const tags = (formData.get("stopTags") as string)?.trim();
  const source = (formData.get("source") as string)?.trim();
  const interval = (formData.get("interval") as string)?.trim();
  let fieldMatching: string | JsonObject = formData.get(
    "fieldMatching",
  ) as string;

  let errors = {};

  if (source.length === 0) {
    errors = { ...errors, source: "Source URL is required" };
  }

  if (source.length > 130) {
    errors = { ...errors, source: "Max Source URL length - 130" };
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

  if (name.length === 0) {
    errors = { ...errors, name: "Title is required" };
  }

  if (name.length > 60) {
    errors = { ...errors, name: "Max title length - 60" };
  }

  const tagsList =
    tags.length > 0 ? tags.split(",").map((tag) => tag.trim()) : [];

  if (tagsList.length > 15) {
    errors = { ...errors, stopTags: "Max stop tags count - 15" };
  }

  if (!Interval[interval]) {
    errors = { ...errors, interval: "Incorrect interval value" };
  }

  if (!isEmpty(errors)) {
    return json({ status: "error", errors }, { status: 400 });
  }

  const updatedRss = await updateRssSource(params.rssId, {
    source,
    stopTags: tagsList,
    fieldMatching: fieldMatching as JsonObject,
    name,
    interval: Interval[interval],
    isPaused: rss.isPaused,
  });

  return { status: "success", updatedRss, message: "Rss successfully updated" };
};
