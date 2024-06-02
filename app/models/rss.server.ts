import type { RSSSettings } from "@prisma/client";

import { prisma } from "~/db.server";
import { Prisma } from "@prisma/client";
import JsonObject = Prisma.JsonObject;
import SortOrder = Prisma.SortOrder;

export type { RSSSettings, Interval } from "@prisma/client";

export async function getRssListItems(): Promise<Pick<RSSSettings, "id" | "name">[]> {
  return prisma.rSSSettings.findMany({
    select: { id: true, name: true },
    orderBy: { updatedAt: SortOrder.desc }
  });
}

export async function getRssById(id: RSSSettings["id"]): Promise<RSSSettings> {
  return prisma.rSSSettings.findUnique({ where: { id } });
}

export async function createRssSource(
  {
    interval,
    source,
    name,
    fieldMatching,
    stopTags
  }: Pick<RSSSettings, "interval" | "stopTags" | "name" | "source"> & {
    fieldMatching: JsonObject
  }): Promise<RSSSettings> {
  return prisma.rSSSettings.create({
    data: {
      source,
      name,
      fieldMatching,
      stopTags,
      interval
    }
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
    isPaused
  }: Pick<RSSSettings, "interval" | "stopTags" | "name" | "source" | "isPaused"> & {
    fieldMatching: JsonObject
  }): Promise<RSSSettings> {
  return prisma.rSSSettings.update({
    where: {
      id
    },
    data: {
      isPaused,
      source,
      name,
      fieldMatching,
      stopTags,
      interval
    }
  });
}

export async function deleteRssById(id: RSSSettings["id"]): Promise<RSSSettings> {
  return prisma.rSSSettings.delete({ where: { id } });
}
