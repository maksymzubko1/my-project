import type { Mixin, MixinSettings } from "@prisma/client";
import { Prisma } from "@prisma/client";

import { prisma } from "~/db.server";
import { getPost } from "~/models/posts.server";
import {
  IMixinListProps,
  TMixin,
  TMixinCreate,
  TMixinRandom,
  TMixinUpdate,
} from "~/models/types/mixin.types";
import { getRandomValuesFromArray } from "~/utils";

import SortOrder = Prisma.SortOrder;

export type { Mixin, MixinType, PageType, DisplayOn } from "@prisma/client";

export async function getRandomMixinList({
  page,
  search,
  postIds,
}: IMixinListProps): Promise<TMixinRandom[]> {
  const where = { draft: false };

  switch (page) {
    case "search":
      where["NOT"] = [{ displayOn: "LIST" }];
      break;
    case "list":
      where["NOT"] = [{ displayOn: "SEARCH" }, { pageType: "TAG_FILTER" }];
      break;
    case "tag":
      where["NOT"] = [{ displayOn: "SEARCH" }, { pageType: "MAIN" }];
      break;
  }

  if (postIds && postIds.length > 0) {
    where["NOT"] = [
      ...where["NOT"],
      {
        AND: [
          {
            NOT: {
              postId: null,
            },
          },
          {
            postId: {
              in: postIds,
            },
          },
        ],
      },
    ];
  }

  let idList = await prisma.mixin.findMany({
    where,
    select: {
      id: true,
      regex: true,
      displayOn: true,
      postId: true,
    },
  });

  if (search && search.length > 0 && page === "search") {
    idList = idList.filter((item) => {
      if (item.regex && item.regex?.length > 0) {
        return (item.regex as RegExp)?.test(search);
      }
      return true;
    });
  }

  const settings = await getMixinSettings();
  let maxLength;

  if (page === "search") {
    maxLength = settings?.mixinPerSearch || 3;
  } else {
    maxLength = settings?.mixinPerList || 3;
  }

  const randomizedId = getRandomValuesFromArray(
    idList.map((val) => val.id),
    maxLength,
  );
  where["id"] = { in: randomizedId };

  return prisma.mixin.findMany({
    where,
    select: {
      id: true,
      type: true,
      name: true,
      text: true,
      textForLink: true,
      linkForImage: true,
      linkForText: true,
      image: true,
      post: {
        select: {
          id: true,
          body: true,
          title: true,
          description: true,
          status: true,
          image: {
            select: {
              id: true,
              url: true,
            },
          },
          tagPost: {
            select: {
              tag: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
      },
    },
    orderBy: {
      priority: SortOrder.desc,
    },
  });
}

export async function getMixin({ id }: Pick<Mixin, "id">): Promise<TMixin> {
  const mixin = await prisma.mixin.findFirst({
    select: {
      id: true,
      type: true,
      name: true,
      linkForImage: true,
      linkForText: true,
      text: true,
      displayOn: true,
      textForLink: true,
      pageType: true,
      priority: true,
      regex: true,
      draft: true,
      image: {
        select: {
          id: true,
          url: true,
        },
      },
      postId: true,
    },
    where: { id },
  });

  if (mixin?.postId) {
    const post = await getPost({ id: mixin.postId });
    if (post) {
      mixin.post = { name: post.name };
    }
  }

  return mixin;
}

export async function getMixinListItems({
  sort,
  query,
}: {
  sort?: string | null;
  query?: string | null;
}): Promise<Pick<Mixin, "id" | "name" | "draft">[]> {
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
      OR: [{ name: { contains: query } }],
    };
  }

  return prisma.mixin.findMany({
    select: { id: true, name: true, draft: true },
    where,
    orderBy,
  });
}

export async function createMixin(
  {
    type,
    text,
    linkForImage,
    linkForText,
    displayOn,
    pageType,
    priority,
    regex,
    textForLink,
    name,
    image,
    postId,
  }: TMixinCreate,
  isDrafted = false,
): Promise<Mixin> {
  const mixinData: any = {
    type,
    text,
    linkForImage,
    linkForText,
    name,
    displayOn,
    pageType,
    textForLink,
    priority,
    regex,
    draft: isDrafted,
  };

  if (image && image.length) {
    mixinData.image = {
      create: {
        url: image,
      },
    };
  }

  if (postId && postId.length) {
    mixinData.post = {
      connect: {
        id: postId,
      },
    };
  }

  return prisma.mixin.create({
    data: mixinData,
  });
}

export async function updateMixin(
  id: Mixin["id"],
  {
    type,
    text,
    linkForImage,
    linkForText,
    displayOn,
    pageType,
    priority,
    name,
    regex,
    textForLink,
    image,
    postId,
  }: TMixinUpdate,
): Promise<TMixin> {
  const mixin = await getMixin({ id });

  const mixinData: any = {
    type,
    text,
    linkForImage,
    linkForText,
    name,
    displayOn,
    textForLink,
    pageType,
    priority,
    regex,
    draft: false,
  };

  if (mixin.draft) {
    mixin.draft = false;
  }

  if (image && image.length) {
    mixinData.image = {
      create: {
        url: image,
      },
    };
  }

  if (postId && postId.length) {
    mixinData.post = {
      connect: {
        id: postId,
      },
    };
  }

  await prisma.mixin.update({
    data: mixinData,
    where: {
      id,
    },
  });

  return getMixin({ id });
}

export async function getMixinSettings(): Promise<MixinSettings> {
  return prisma.mixinSettings.findFirst();
}

export async function createOrUpdateSettings({
  mixinPerSearch,
  mixinPerList,
}: Pick<
  MixinSettings,
  "mixinPerSearch" | "mixinPerList"
>): Promise<MixinSettings> {
  const settings = await prisma.mixinSettings.findFirst();
  if (!settings) {
    return prisma.mixinSettings.create({
      data: {
        mixinPerSearch,
        mixinPerList,
      },
    });
  } else {
    return prisma.mixinSettings.update({
      data: {
        mixinPerSearch,
        mixinPerList,
      },
      where: {
        id: settings.id,
      },
    });
  }
}

export async function deleteMixin({ id }: Pick<Mixin, "id">) {
  return prisma.mixin.deleteMany({
    where: { id },
  });
}
