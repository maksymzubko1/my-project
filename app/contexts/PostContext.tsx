import {createContext} from "react";
import {FormProps} from "~/contexts/types";

export interface PostFormState {
  title: string,
  image: string | undefined;
  localFile: File | null | undefined;
  body: string,
  tags: string[],
}

export interface Extras {
  isDirty?: boolean;
}

export const PostFormContext = createContext<FormProps<PostFormState, Extras>>({
  isLoading: false,
  onChange: () => {},
  onSubmit: () => {},
  values: {
    title: "",
    localFile: null,
    image: "",
    body: "",
    tags: [],
  },
  extras: {},
  errors: {}
});
