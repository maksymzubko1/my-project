import type { Mixin } from "@prisma/client";

import { prisma } from "~/db.server";

import { getPost } from "~/models/posts.server";
import { TMixin, TMixinCreate, TMixinUpdate } from "~/models/types/mixin.types";
import { Prisma } from "@prisma/client";
import SortOrder = Prisma.SortOrder;

export type { Mixin, MixinType } from "@prisma/client";

export async function getMixin({ id }: Pick<Mixin, "id">): Promise<TMixin> {
  const mixin = await prisma.post.findFirst({
    select: {
      id: true,
      type: true,
      name: true,
      link: true,
      text: true,
      displayOn: true,
      pageType: true,
      priority: true,
      regex: true,
      draft: true,
      image: {
        select: {
          id: true,
          url: true
        }
      },
      postId: true
    },
    where: { id }
  });

  if (mixin?.postId) {
    const post = await getPost({ id: mixin.postId });
    if (post) {
      mixin["post"] = post;
    }
  }

  return mixin;
}

export async function getMixinListItems(
  {
    sort,
    query
  }: {
    sort?: string | null;
    query?: string | null;
  }): Promise<Pick<Mixin, "id" | "name">[]> {
  let orderBy: any = { createdAt: SortOrder.desc };
  let where: any = {};

  if (sort && sort.split("_").length === 2) {
    const sortBy = sort.split("_");
    switch (sortBy[0]) {
      case "id":
        orderBy = { id: sortBy[1] };
        break;
      case "name":
        orderBy = { name: sortBy[1] };
        break;
      case "datecreate":
        orderBy = { createdAt: sortBy[1] };
        break;
      case "dateupdate":
        orderBy = { updatedAt: sortBy[1] };
        break;
    }
  }

  if (query && query.length > 0) {
    where = {
      OR: [{ name: { contains: query } }]
    };
  }

  return prisma.mixin.findMany({
    select: { id: true, name: true },
    where,
    orderBy
  });
}

export async function createMixin(
  {
    type,
    text,
    link,
    displayOn,
    postType,
    priority,
    regex,
    name,
    image,
    postId
  }: TMixinCreate,
  isDrafted = false
): Promise<Mixin> {
  const mixinData: any = {
    type,
    text,
    link,
    name,
    displayOn,
    postType,
    priority,
    regex,
    draft: isDrafted
  };

  if (image) {
    mixinData.image = {
      create: {
        url: image
      }
    };
  }

  return prisma.mixin.create({
    data: mixinData
  });
}

export async function updateMixin(
  id: Mixin["id"],
  {
    type,
    text,
    link,
    displayOn,
    postType,
    priority,
    name,
    regex,
    image,
    postId
  }: TMixinUpdate
): Promise<TMixin> {
  const mixin = await getMixin({ id });

  const mixinData: any = {
    type,
    text,
    link,
    name,
    displayOn,
    postType,
    priority,
    regex,
    draft: false
  };

  if (mixin.draft) {
    mixin.draft = false;
  }

  if (image) {
    mixinData.image = {
      create: {
        url: image
      }
    };
  }

  if (postId) {
    mixinData.post = {
      connect: {
        id: postId
      }
    };
  }

  await prisma.mixin.update({
    data: mixinData,
    where: {
      id
    }
  });

  return getMixin({ id });
}

export async function deleteMixin({ id }: Pick<Mixin, "id">) {
  return prisma.mixin.deleteMany({
    where: { id }
  });
}
