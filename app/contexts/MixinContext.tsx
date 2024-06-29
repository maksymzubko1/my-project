import { Mixin } from "@prisma/client";
import { createContext } from "react";

import { FormProps } from "~/contexts/types";

export interface MixinFormState {
  type?: Mixin["type"] | null;
  name?: string;
  draft: boolean;
  linkForImage?: string;
  linkForText?: string;
  text?: string;
  displayOn?: Mixin["displayOn"] | null;
  pageType?: Mixin["pageType"] | null;
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
    type: null,
    name: "",
    draft: false,
    linkForText: "",
    linkForImage: "",
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
