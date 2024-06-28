import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";

import { getMixinListItems, getMixinSettings } from "~/models/mixin.server";
import { requireUserId } from "~/session.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await requireUserId(request);

  const url = new URL(request.url);

  const query = url.searchParams.get("query");
  const sort = url.searchParams.get("sortBy");

  const mixinSettings = await getMixinSettings();
  const mixinListItems = await getMixinListItems({ sort, query });
  return json({ mixinListItems, mixinSettings });
};
