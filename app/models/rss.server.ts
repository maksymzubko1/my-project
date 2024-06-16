import type { RSSSettings } from "@prisma/client";
import { Prisma } from "@prisma/client";

import { prisma } from "~/db.server";

import JsonObject = Prisma.JsonObject;
import SortOrder = Prisma.SortOrder;

export type { RSSSettings } from "@prisma/client";
export { Interval } from "@prisma/client";

export async function getRssListItems({
  sort,
  query,
}: {
  sort?: string | null;
  query?: string | null;
}): Promise<Pick<RSSSettings, "id" | "name">[]> {
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

  return prisma.rSSSettings.findMany({
    select: { id: true, name: true, isPaused: true },
    where,
    orderBy,
  });
}

export async function getRssById(id: RSSSettings["id"]): Promise<RSSSettings> {
  return prisma.rSSSettings.findUnique({ where: { id } });
}

export async function createRssSource({
  interval,
  source,
  name,
  fieldMatching,
  stopTags,
}: Pick<RSSSettings, "interval" | "stopTags" | "name" | "source"> & {
  fieldMatching: JsonObject;
}): Promise<RSSSettings> {
  return prisma.rSSSettings.create({
    data: {
      source,
      name,
      fieldMatching,
      stopTags,
      interval,
    },
  });
}

export async function updateRssSource(
  id: RSSSettings["id"],
  {
    interval,
    source,
    name,
    fieldMatching,
    stopTags,
    isPaused,
  }: Pick<
    RSSSettings,
    "interval" | "stopTags" | "name" | "source" | "isPaused"
  > & {
    fieldMatching: JsonObject;
  },
): Promise<RSSSettings> {
  return prisma.rSSSettings.update({
    where: {
      id,
    },
    data: {
      isPaused,
      source,
      name,
      fieldMatching,
      stopTags,
      interval,
    },
  });
}

export async function deleteRssById(
  id: RSSSettings["id"],
): Promise<RSSSettings> {
  return prisma.rSSSettings.delete({ where: { id } });
}

export async function changePauseRss(
  id: RSSSettings["id"],
  pauseState: boolean,
): Promise<RSSSettings> {
  const rss = await getRssById(id);

  if (!rss) {
    throw new Error("Rss not found.");
  }

  return prisma.rSSSettings.update({
    where: { id },
    data: { isPaused: pauseState },
  });
}
