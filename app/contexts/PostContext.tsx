import { PostType } from "@prisma/client";
import { createContext } from "react";

import { FormProps } from "~/contexts/types";

export interface PostFormState {
  title: string;
  image: string | undefined;
  localFile: File | null | undefined;
  description: string;
  body: string;
  tags: string[];
  status?: PostType;
}

export interface Extras {
  isDirty?: boolean;
}

export const PostFormContext = createContext<FormProps<PostFormState, Extras>>({
  isLoading: false,
  onChange: () => {
    console.log("on change");
  },
  onSubmit: () => {
    console.log("on submit");
  },
  values: {
    title: "",
    localFile: null,
    image: "",
    body: "",
    description: "",
    tags: [],
  },
  extras: {},
  errors: {},
});
