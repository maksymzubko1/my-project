import { Mixin as TMixin, Post as TPost } from "@prisma/client";

import Mixin from "~/components/Mixin/Mixin";
import Post from "~/components/Post/Post";

interface IPostWithMixins {
  posts: TPost[];
  mixins: TMixin[];
}

const PostsWithMixins = ({ posts, mixins }: IPostWithMixins) => {
  const mixPosts = (posts, mixins) => {
    const mixedArray = posts.map((post) => ({ ...post, customType: "post" }));
    const step = Math.ceil(posts.length / (mixins.length + 1));

    mixins.forEach((mixin, index) => {
      mixedArray.splice((index + 1) * step, 0, {
        ...mixin,
        customType: "mixin",
      });
    });

    return mixedArray;
  };

  const mixedPosts = mixPosts(posts, mixins);

  const renderItem = (item) => {
    if (item.customType === "post") {
      return <Post key={item.id} {...item} />;
    } else if (item.customType === "mixin") {
      return <Mixin key={item.id} {...item} />;
    } else {
      return null;
    }
  };

  return (
    <section
      id={"posts-list"}
      className="w-full flex flex-col gap-[20px] justify-center p-4"
    >
      {posts.length > 0 ? (
        mixedPosts.map((item) => renderItem(item))
      ) : (
        <div className="px-2 py-2 w-full mt-4">
          <h2 className="font-semibold w-full px-4 text-center text-lg">
            No posts found!
          </h2>
        </div>
      )}
    </section>
  );
};

export default PostsWithMixins;
