import { Media, Post, Tag } from "@prisma/client";

export type TPost = Pick<
  Post,
  "id" | "body" | "title" | "description" | "status"
> & {
  image: Pick<Media, "url" | "id"> | null;
  tagPost: { tag: Pick<Tag, "name"> }[];
};

export type TCreatePost = Pick<Post, "body" | "title" | "description"> & {
  createdAt?: Post["createdAt"];
} & {
  tags: Tag["name"][];
} & {
  image?: string;
};

export type TUpdatePost = Pick<Post, "body" | "title" | "description"> & { tags: Tag["name"][] } & {
  image?: string;
};

export interface PostMixedType {
  items: {
    id: Post["id"];
    title: Post["title"];
    body: Post["body"];
    description: Post["description"];
    createdAt: Post["createdAt"];
    image: {
      id: Media["id"];
      url: Media["url"];
    } | null;
    tagPost: {
      tag: {
        name: Tag["name"];
      };
    }[];
  }[];
  totalPages: number;
  currentPage: number;
  hasNext: boolean;
  hasPrev: boolean;
}
