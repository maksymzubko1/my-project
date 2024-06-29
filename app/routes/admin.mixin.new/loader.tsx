export const loader = async () => {
  return {
    mixin: {
      type: "",
      name: "",
      textForLink: "",
      draft: false,
      linkForImage: "",
      linkForText: "",
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
