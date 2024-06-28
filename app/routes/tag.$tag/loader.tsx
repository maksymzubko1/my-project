import { json, LoaderFunctionArgs } from "@remix-run/node";
import invariant from "tiny-invariant";

import { getPostListItemsWithMixing } from "~/models/posts.server";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  invariant(params.tag, "tag not found");
  const url = new URL(request.url);

  const page = url.searchParams.get("page");

  const { items, mixin, totalPages, hasPrev, hasNext, currentPage } =
    await getPostListItemsWithMixing({
      page: page ? parseInt(page) : undefined,
      tag: params.tag,
      pageName: "tag"
    });
  return json({ items, mixin, currentPage, totalPages, hasNext, hasPrev });
};
