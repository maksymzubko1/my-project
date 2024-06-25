import { Mixin } from "@prisma/client";
import { createContext } from "react";

import { FormProps } from "~/contexts/types";

export interface MixinFormState {
  type?: Mixin["type"];
  name?: string;
  draft: boolean;
  link?: string;
  text?: string;
  displayOn?: Mixin["displayOn"];
  pageType: Mixin["pageType"];
  priority?: number;
  regex?: string;
  image?: string;
  imageId?: string;
  textForLink: string;
  postId?: string;
  post?: { name: string };
  localFile?: File | null;
}

export interface Extras {
  isDirty?: boolean;
}

export const MixinFormContext = createContext<
  FormProps<MixinFormState, Extras>
>({
  isLoading: false,
  onChange: () => {
    console.log("on change");
  },
  onSubmit: () => {
    console.log("on submit");
  },
  values: {
    type: "",
    name: "",
    draft: false,
    link: "",
    text: "",
    displayOn: null,
    pageType: null,
    textForLink: "",
    priority: 0,
    regex: "",
    image: null,
    imageId: "",
    postId: "",
    post: null,
    localFile: null,
  },
  extras: {},
  errors: {},
});
