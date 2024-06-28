import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import invariant from "tiny-invariant";

import { getMixin } from "~/models/mixin.server";
import { requireUserId } from "~/session.server";

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
  await requireUserId(request);
  invariant(params.mixinId, "mixinId not found");

  const mixin = await getMixin({ id: params.mixinId });

  if (!mixin) {
    throw new Response("Not Found", { status: 404 });
  }

  return json({
    mixin: {
      type: mixin.type,
      name: mixin.name,
      textForLink: mixin.textForLink,
      draft: mixin.draft,
      link: mixin.link,
      text: mixin.text,
      displayOn: mixin.displayOn,
      pageType: mixin.pageType,
      priority: mixin.priority,
      regex: mixin.regex,
      image: mixin.image?.url,
      imageId: mixin.imageId,
      postId: mixin.postId,
      post: mixin.post,
      localFile: null,
    },
  });
};
