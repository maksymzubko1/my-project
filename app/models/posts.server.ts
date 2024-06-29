import type { Post } from "@prisma/client";
import { Prisma } from "@prisma/client";

import { prisma } from "~/db.server";
import { deleteMedia } from "~/models/media.server";
import { getRandomMixinList } from "~/models/mixin.server";
import { createTags } from "~/models/tags.server";
import {
  PostMixedType,
  TCreatePost,
  TPost,
  TUpdatePost,
} from "~/models/types/posts.types";

import SortOrder = Prisma.SortOrder;

export type { Post, PostType } from "@prisma/client";

export async function getPost({ id }: Pick<Post, "id">): Promise<TPost> {
  return prisma.post.findFirst({
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
    where: { id },
  });
}

export async function getPostListItems({
  sort,
  query,
}: {
  sort?: string | null;
  query?: string | null;
}): Promise<Pick<Post, "id" | "title" | "status" | "isDeleted">[]> {
  let orderBy: any = { createdAt: SortOrder.desc };
  let where: any = {};

  if (sort && sort.split("_").length === 2) {
    const sortBy = sort.split("_");
    switch (sortBy[0]) {
      case "id":
        orderBy = { id: sortBy[1] };
        break;
      case "name":
        orderBy = { title: sortBy[1] };
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
      OR: [
        { title: { contains: query } },
        { body: { contains: query } },
        { description: { contains: query } },
        {
          tagPost: {
            some: {
              tag: {
                name: { equals: query },
              },
            },
          },
        },
      ],
    };
  }

  return prisma.post.findMany({
    select: { id: true, title: true, status: true, isDeleted: true },
    orderBy,
    where,
  });
}

export async function getPostListItemsWithMixing({
  sort,
  query,
  page,
  tag,
  pageName,
  pageSize = 10,
}: {
  sort?: string | null;
  query?: string | null;
  page?: number;
  pageSize?: number;
  pageName: "search" | "list" | "tag";
  tag?: string;
}): Promise<PostMixedType> {
  let orderBy: any = { createdAt: SortOrder.desc };
  let where: any = {};

  if (sort && sort.split("_").length === 2) {
    const sortBy = sort.split("_");
    switch (sortBy[0]) {
      case "id":
        orderBy = { id: sortBy[1] };
        break;
      case "name":
        orderBy = { title: sortBy[1] };
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
      OR: [
        { title: { contains: query } },
        { body: { contains: query } },
        { description: { contains: query } },
      ],
    };
  }

  if (tag && tag.length > 0) {
    where = {
      ...where,
      tagPost: {
        some: {
          tag: {
            name: { equals: tag },
          },
        },
      },
    };
  }

  const totalCount = await prisma.post.count({ where });
  const totalPages = Math.ceil(totalCount / pageSize);

  const currentPage = page && page > 0 ? page : 1;
  const skip = (currentPage - 1) * pageSize;

  const hasNext = currentPage < totalPages;
  const hasPrev = currentPage > 1;

  const items = await prisma.post.findMany({
    select: {
      id: true,
      title: true,
      body: true,
      description: true,
      createdAt: true,
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
    orderBy,
    where,
    skip,
    take: pageSize,
  });

  const mixin = await getRandomMixinList({
    page: pageName,
    search: query,
    postIds: items.map((item) => item.id),
  });

  return { items, mixin, totalPages, currentPage, hasNext, hasPrev };
}

export async function createPost(
  { body, title, image, tags, description, createdAt }: TCreatePost,
  isDrafted = false,
): Promise<Post> {
  const createdTags = await createTags({ tags });

  const postData: any = {
    title,
    body,
    description,
    status: isDrafted ? "DRAFTED" : "DEFAULT",
    tagPost: {
      create: createdTags.map((tag) => ({
        tag: {
          connect: { id: tag.id },
        },
      })),
    },
  };

  if (image) {
    postData.image = {
      create: {
        url: image,
      },
    };
  }

  if (createdAt) {
    postData.createdAt = createdAt;
  }

  return prisma.post.create({
    data: postData,
  });
}

export async function updatePost(
  postId: Post["id"],
  { body, title, image, description, tags }: TUpdatePost,
): Promise<TPost> {
  const post = await getPost({ id: postId });

  const createdTags = await createTags({ tags });

  const postData: any = {
    title,
    body,
    description,
    tagPost: {
      deleteMany: {},
      create: createdTags.map((tag) => ({
        tag: {
          connect: { id: tag.id },
        },
      })),
    },
  };

  if (post.status === "DRAFTED") {
    postData.status = "DEFAULT";
  }

  if (image) {
    if (post?.image?.id) {
      await deleteMedia({ id: post.image.id });
    }

    postData.image = {
      create: {
        url: image,
      },
    };
  }

  return prisma.post.update({
    data: postData,
    where: {
      id: postId,
    },
    select: {
      id: true,
      body: true,
      title: true,
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
  });
}

export async function changePostStatus({
  id,
  status,
  isDeleted,
}: Pick<Post, "id"> & {
  status?: Post["status"];
  isDeleted?: Post["isDeleted"];
}) {
  const post = await getPost({ id });

  if (!post) {
    throw new Error("Post not found");
  }

  return prisma.post.update({
    where: { id },
    data: {
      status: status || undefined,
      isDeleted: isDeleted || undefined,
    },
  });
}

export async function deletePost({ id }: Pick<Post, "id">) {
  return prisma.post.deleteMany({
    where: { id },
  });
}
