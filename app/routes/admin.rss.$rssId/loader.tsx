import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import invariant from "tiny-invariant";

import { getRssById } from "~/models/rss.server";
import RssService from "~/services/rss.service";
import { requireUserId } from "~/session.server";

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
  await requireUserId(request);
  invariant(params.rssId, "rssId not found");

  const rss = await getRssById(params.rssId);

  if (!rss) {
    throw new Response("Not Found", { status: 404 });
  }

  let keys = null;
  try {
    keys = (await RssService.isValidRss(rss.source)).keys;
  } catch (e) {
    console.log("fetch_rss error", e.message);
  }

  return json({
    rss: {
      name: rss.name,
      source: rss.source,
      interval: rss.interval,
      stopTags: rss.stopTags,
      fieldMatching: rss.fieldMatching,
      keys,
      isPaused: rss.isPaused,
    },
  });
};
