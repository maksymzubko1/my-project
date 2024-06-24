import { Media, Mixin } from "@prisma/client";

import { TPost } from "~/models/types/posts.types";

export type TMixin = Omit<Mixin, "createdAt" | "updatedAt"> & {
  post?: TPost;
} & {
  image?: {
    id: Media["id"];
    url: Media["url"];
  };
};

export type TMixinCreate = Omit<
  Mixin,
  "createdAt" | "updatedAt" | "imageId" | "id" | "draft"
> & { image: string };

export type TMixinUpdate = Omit<
  Mixin,
  "createdAt" | "updatedAt" | "imageId" | "id" | "draft"
> & { image: string };
