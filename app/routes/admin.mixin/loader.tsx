import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";

import { requireUserId } from "~/session.server";
import { getMixinListItems } from "~/models/mixin.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await requireUserId(request);

  const url = new URL(request.url);

  const query = url.searchParams.get("query");
  const sort = url.searchParams.get("sortBy");

  const mixinListItems = await getMixinListItems({ sort, query });
  return json({ mixinListItems });
};
