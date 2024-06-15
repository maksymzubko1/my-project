import type { LoaderFunctionArgs } from "@remix-run/node";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  return {post: { body: "", tags: [] as string[], title: "", description: "", image: undefined, localFile: null }}
};