import type { ActionFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import invariant from "tiny-invariant";

import { getRssById, deleteRssById, changePauseRss } from "~/models/rss.server";
import { requireUserId } from "~/session.server";

export const action = async ({ params, request }: ActionFunctionArgs) => {
  await requireUserId(request);
  invariant(params.rssId, "rssId not found");

  const rss = await getRssById(params.rssId);

  if (!rss) {
    return json({ status: "error", message: "Not found rss" }, { status: 404 });
  }

  const action = params.action;

  if (!action || !["pause", "resume", "delete"].includes(action)) {
    return json(
      { status: "error", message: "Incorrect params" },
      { status: 400 },
    );
  }

  try {
    switch (action) {
      case "delete":
        await deleteRssById(params.rssId);
        return json(
          { status: "success", message: "Rss has been deleted" },
          { status: 200 },
        );
      case "resume":
        await changePauseRss(params.rssId, false);
        return json(
          { status: "success", message: "Rss has been resumed" },
          { status: 200 },
        );
      case "pause":
        await changePauseRss(params.rssId, true);
        return json(
          { status: "success", message: "Rss has been paused" },
          { status: 200 },
        );
    }
  } catch (e) {
    return json(
      { status: "error", message: e.message || "Unexpected error" },
      { status: 500 },
    );
  }
};
