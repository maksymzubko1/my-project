export const loader = async () => {
  return {
    mixin: {
      type: "",
      name: "",
      textForLink: "",
      draft: false,
      link: "",
      text: "",
      displayOn: null,
      pageType: null,
      priority: 0,
      regex: "",
      image: null,
      imageId: "",
      postId: "",
      post: null,
      localFile: null,
    },
  };
};
