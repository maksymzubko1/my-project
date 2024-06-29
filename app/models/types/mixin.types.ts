import { Media, Mixin, Post, Tag } from "@prisma/client";

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
  | "linkForText"
  | "linkForImage"
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
  | "linkForImage"
  | "linkForText"
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

export type TMixinRandom = Pick<
  Mixin,
  | "id"
  | "linkForImage"
  | "linkForText"
  | "type"
  | "textForLink"
  | "text"
  | "name"
> & { image: Media } & {
  post: Post & {
    tagPost: {
      tag: {
        name: Tag["name"];
      };
    }[];
    image: {
      id: Media["id"];
      url: Media["url"];
    };
  };
};
