export const loader = async () => {
  return {
    post: {
      body: "",
      tags: [] as string[],
      title: "",
      description: "",
      image: undefined,
      localFile: null,
    },
  };
};
