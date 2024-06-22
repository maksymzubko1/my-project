import { json, LoaderFunctionArgs } from "@remix-run/node";

import { getPostListItemsWithMixing } from "~/models/posts.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);

  const page = url.searchParams.get("page");
  const query = url.searchParams.get("query");

  const { items, totalPages, hasPrev, hasNext, currentPage } =
    await getPostListItemsWithMixing({
      query: query ?? undefined,
      page: page ? parseInt(page) : undefined,
    });
  return json({ items, currentPage, totalPages, hasNext, hasPrev });
};
