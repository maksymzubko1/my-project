import type { LoaderFunctionArgs } from "@remix-run/node";
import { requireUserId } from "~/session.server";
import invariant from "tiny-invariant";
import { getPost } from "~/models/posts.server";
import { json } from "@remix-run/node";

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
  await requireUserId(request);
  invariant(params.postId, "postId not found");

  const post = await getPost({ id: params.postId });

  if (!post) {
    throw new Response("Not Found", { status: 404 });
  }

  const tags = post.tagPost.map(tag => tag.tag.name);
  return json({ post: { title: post.title, body: post.body, tags, status: post.status, image: post?.image?.url, description: post?.description || "" } });
};