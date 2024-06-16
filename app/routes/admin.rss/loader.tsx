import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";

import { getRssListItems } from "~/models/rss.server";
import { requireUserId } from "~/session.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await requireUserId(request);

  const url = new URL(request.url);

  const query = url.searchParams.get("query");
  const sort = url.searchParams.get("sortBy");

  const rssListItems = await getRssListItems({ sort, query });
  return json({ rssListItems });
};
