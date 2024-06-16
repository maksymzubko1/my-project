import type { Post, Tag } from "@prisma/client";

import { prisma } from "~/db.server";

export type { Tag } from "@prisma/client";

export async function getTag({ id }: Pick<Tag, "id">): Promise<Tag> {
  return prisma.tag.findFirst({
    select: { id: true, name: true },
    where: { id },
  });
}

export async function getTagsListItems({
  postId,
}: {
  postId: Post["id"];
}): Promise<{ tag: Tag }[]> {
  return prisma.tagPost.findMany({
    select: { tag: true },
    where: {
      postId,
    },
  });
}

export async function createTag({ name }: Pick<Tag, "name">): Promise<Tag> {
  const tag = await prisma.tag.findFirst({ where: { name } });

  if (tag) {
    return tag;
  }

  return prisma.tag.create({
    data: {
      name,
    },
  });
}

export async function createTags({
  tags,
}: {
  tags: Tag["name"][];
}): Promise<Tag[]> {
  const createdTags = [];
  const uniqueTags = [...new Set(tags)];

  for (const tag of uniqueTags) {
    const createdTag = await createTag({ name: tag });
    createdTags.push(createdTag);
  }

  return createdTags;
}

export async function clearTags({ postId }: { postId: Post["id"] }) {
  prisma.tagPost.deleteMany({
    where: {
      postId,
    },
  });
}

export async function deleteTag({ id }: Pick<Tag, "id">) {
  return prisma.tag.deleteMany({
    where: { id },
  });
}
