import { json, LoaderFunctionArgs } from "@remix-run/node";

import { getPostListItemsWithMixing } from "~/models/posts.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);

  const page = url.searchParams.get("page");

  const { items, mixin, totalPages, hasPrev, hasNext, currentPage } =
    await getPostListItemsWithMixing({
      page: page ? parseInt(page) : undefined,
      pageName: "list",
    });
  return json({ items, mixin, currentPage, totalPages, hasNext, hasPrev });
};
