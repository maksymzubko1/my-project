import { json, LoaderFunctionArgs } from "@remix-run/node";
import invariant from "tiny-invariant";

import { getPostListItemsWithMixing } from "~/models/posts.server";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  invariant(params.tags, "tags not found");
  const url = new URL(request.url);

  const page = url.searchParams.get("page");

  const { items, mixin, totalPages, hasPrev, hasNext, currentPage } =
    await getPostListItemsWithMixing({
      page: page ? parseInt(page) : undefined,
      tags: params.tags?.split("&") || [],
      pageName: "tag",
    });
  return json({ items, mixin, currentPage, totalPages, hasNext, hasPrev });
};
