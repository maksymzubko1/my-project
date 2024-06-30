import { RSSFormState } from "~/contexts/RSSContext";

export const loader = async () => {
  return {
    rss: {
      name: "",
      source: "",
      interval: "everyMinute",
      stopTags: [] as RSSFormState["stopTags"],
      fieldMatching: {} as RSSFormState["fieldMatching"],
      isPaused: false,
    },
  };
};
