import { RSSFormState } from "~/contexts/RSSContext";

export const loader = async () => {
  return {
    mixin: {
      name: "",
      source: "",
      interval: "everyMinute",
      stopTags: [] as RSSFormState["stopTags"],
      fieldMatching: {} as RSSFormState["fieldMatching"],
      isPaused: false,
    },
  };
};
