import { createContext } from "react";
import { FormProps } from "~/contexts/types";

import { Interval } from "~/models/rss.server";

export interface RSSFormState {
  name: string,
  source: string;
  interval: Interval;
  stopTags: string[],
  fieldMatching: { [key: string]: string },
  keys?: string[],
  isPaused: boolean
}

export interface Extras {
  isDirty?: boolean;
}

export const RSSFormContext = createContext<FormProps<RSSFormState, Extras>>({
  isLoading: false,
  onChange: () => {
  },
  onSubmit: () => {
  },
  values: {
    name: "",
    source: "",
    interval: "everyMinute",
    stopTags: [],
    fieldMatching: {},
    isPaused: false,
    keys: [],
  },
  extras: {},
  errors: {}
});
