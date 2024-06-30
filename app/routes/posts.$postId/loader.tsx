import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import invariant from "tiny-invariant";

import { getPost } from "~/models/posts.server";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  invariant(params.postId, "postId not found");

  const post = await getPost({ id: params.postId });

  if (!post) {
    throw new Response("Not Found", { status: 404 });
  }

  if(post.status === "DRAFTED" || post.isDeleted){
    throw new Response("Forbidden", { status: 403 });
  }

  const tags = post.tagPost.map((tag) => tag.tag.name);
  return json({
    post: {
      title: post.title,
      body: post.body,
      tags,
      status: post.status,
      image: post?.image?.url,
      description: post?.description || "",
    },
  });
};
