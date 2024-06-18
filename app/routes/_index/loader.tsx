import { json, LoaderFunctionArgs } from "@remix-run/node";
import { getPostListItemsWithMixing } from "~/models/posts.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const postListItems = await getPostListItemsWithMixing({});
  return json({ postListItems });
};