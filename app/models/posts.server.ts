import type { Media, Post, Tag, TagPost } from "@prisma/client";

import { prisma } from "~/db.server";
import { Prisma } from "@prisma/client";
import SortOrder = Prisma.SortOrder;
import { clearTags, createTags } from "~/models/tags.server";
import { deleteMedia } from "~/models/media.server";

export type { Post } from "@prisma/client";
type PostType = Pick<Post, "id" | "body" | "title"> & {
  image: Pick<Media, "url" | "id"> | null;
  tagPost: { tag: Pick<Tag, "name"> }[]
};

export async function getPost({ id }: Pick<Post, "id">):
  Promise<PostType> {
  return prisma.post.findFirst({
    select: {
      id: true, body: true, title: true,
      image: {
        select: {
          id: true,
          url: true
        }
      },
      tagPost: {
        select: {
          tag: {
            select: {
              name: true
            },
          }
        }
      }
    },
    where: { id }
  });
}

export async function getPostListItems(): Promise<Pick<Post, "id" | "title">[]> {
  return prisma.post.findMany({
    select: { id: true, title: true },
    orderBy: { updatedAt: SortOrder.desc }
  });
}

export async function createPost({
                                   body,
                                   title,
                                   image,
                                   tags
                                 }: Pick<Post, "body" | "title"> & { tags: Tag["name"][] } & {
  image?: string;
}): Promise<Post> {
  const createdTags = await createTags({ tags });

  const postData: any = {
    title,
    body,
    tagPost: {
      create: createdTags.map((tag) => ({
        tag: {
          connect: { id: tag.id }
        }
      }))
    }
  };

  if (image) {
    postData.image = {
      create: {
        url: image
      }
    };
  }

  return prisma.post.create({
    data: postData
  });
}

export async function updatePost(postId: Post["id"], {
  body,
  title,
  image,
  tags
}: Pick<Post, "body" | "title"> & { tags: Tag["name"][] } & {
  image?: string;
}): Promise<PostType> {
  const post = await getPost({ id: postId });

  const createdTags = await createTags({ tags });

  const postData: any = {
    title,
    body,
    tagPost: {
      deleteMany: {},
      create: createdTags.map((tag) => ({
        tag: {
          connect: { id: tag.id }
        }
      }))
    }
  };

  if(post?.image?.id){
    await deleteMedia({ id: post.image.id });
  }

  if (image) {
    postData.image = {
      create: {
        url: image
      }
    };
  }

  return prisma.post.update({
    data: postData,
    where: {
      id: postId
    },
    select: {
      id: true, body: true, title: true,
      image: {
        select: {
          id: true,
          url: true
        }
      },
      tagPost: {
        select: {
          tag: {
            select: {
              name: true,
            }
          }
        }
      }
    }
  });
}

export async function deletePost({ id }: Pick<Post, "id">) {
  return prisma.post.deleteMany({
    where: { id }
  });
}
