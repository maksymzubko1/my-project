import { Media } from "@prisma/client";

export type TCreateMedia = Pick<Media, "name" | "url">;
