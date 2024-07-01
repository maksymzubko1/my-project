import type { MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

import Pagination from "~/components/Pagination/Pagination";
import PostsWithMixins from "~/components/PostsWithMixins/PostWithMixins";
import ScrollToTop from "~/components/ScrollTop/ScrollTop";
import UserHeader from "~/components/UserHeader/Header";

export const meta: MetaFunction = () => [
  {
    title: "Remix News",
    description: "Explore posts on Remix News.",
    keywords: "posts, articles, blog",
  },
];

import { loader as routeLoader } from "./loader";

export const loader = routeLoader;

export default function Index() {
  const { items, mixin, totalPages, currentPage, hasPrev, hasNext } =
    useLoaderData<typeof loader>();

  return (
    <>
      <UserHeader />
      <main className="absolute top-0 pt-[72px] w-full min-h-screen h-full bg-white flex flex-col items-center pb-3 overflow-y-auto">
        <div className="w-full md:w-[80%] max-w-[1500px] h-auto mx-auto flex flex-col items-center">
          <PostsWithMixins posts={items} mixins={mixin} />
          <section id={"pagination"}>
            <Pagination
              hasPrev={hasPrev}
              hasNext={hasNext}
              current={currentPage}
              total={totalPages}
            />
          </section>
        </div>
      </main>
      <ScrollToTop target={"main"} />
    </>
  );
}
