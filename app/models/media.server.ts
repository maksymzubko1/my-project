import type { Media } from "@prisma/client";

import { prisma } from "~/db.server";
import { TCreateMedia } from "~/models/types/media.types";

export type { Media } from "@prisma/client";

export async function getMedia({
  id,
}: Pick<Media, "id">): Promise<Pick<Media, "id" | "name" | "url"> | null> {
  return prisma.tag.findFirst({
    select: { id: true, name: true, url: true },
    where: { id },
  });
}

export async function createMedia({ name, url }: TCreateMedia): Promise<Media> {
  return prisma.media.create({
    data: {
      name: name ? name : undefined,
      url,
    },
  });
}

export async function deleteMedia({ id }: Pick<Media, "id">) {
  return prisma.media.deleteMany({
    where: { id },
  });
}
