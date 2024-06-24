import { Prisma, RSSSettings } from "@prisma/client";
import JsonObject = Prisma.JsonObject;

export type TCreateRss = Pick<RSSSettings, "interval" | "stopTags" | "name" | "source"> & {
  fieldMatching: JsonObject;
};

export type TUpdateRss = Pick<
  RSSSettings,
  "interval" | "stopTags" | "name" | "source" | "isPaused"
> & {
  fieldMatching: JsonObject;
};