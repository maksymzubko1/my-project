import { Media, Mixin } from "@prisma/client";

export interface IMixinListProps {
  page: "search" | "list" | "tag";
  search?: string;
  postIds?: string[];
}

export type TMixin = Omit<Mixin, "createdAt" | "updatedAt"> & {
  post?: {
    name: string;
  };
} & {
  image?: {
    id: Media["id"];
    url: Media["url"];
  };
};

export type TMixinCreate = Pick<
  Mixin,
  | "link"
  | "type"
  | "displayOn"
  | "pageType"
  | "priority"
  | "regex"
  | "textForLink"
  | "text"
  | "name"
  | "postId"
> & { image: string };

export type TMixinUpdate = Pick<
  Mixin,
  | "link"
  | "type"
  | "displayOn"
  | "pageType"
  | "priority"
  | "regex"
  | "textForLink"
  | "text"
  | "name"
  | "postId"
> & { image: string };
