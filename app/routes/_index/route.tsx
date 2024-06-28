import type { MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

import Pagination from "~/components/Pagination/Pagination";
import Post from "~/components/Post/Post";
import UserHeader from "~/components/UserHeader/Header";

export const meta: MetaFunction = () => [{ title: "Remix Posts" }];

import { loader as routeLoader } from "./loader";

export const loader = routeLoader;

export default function Index() {
  const { items, mixin, totalPages, currentPage, hasPrev, hasNext } =
    useLoaderData<typeof loader>();

  console.log(mixin);
  return (
    <>
      <UserHeader />
      <main className="absolute top-0 pt-[72px] w-full min-h-screen h-full bg-white flex flex-col items-center pb-3 overflow-y-auto">
        <div className="w-full md:w-[80%] max-w-[1500px] h-auto mx-auto flex flex-col items-center">
          <section
            id={"posts-list"}
            className="flex flex-col gap-[20px] justify-center p-4"
          >
            {items.length > 0 ? (
              items.map((item) => <Post key={item.id} {...item} />)
            ) : (
              <div className="px-2 py-2 w-full mt-4">
                <h2 className="font-semibold w-full px-4 text-center text-lg">
                  No posts found!
                </h2>
              </div>
            )}
          </section>
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
    </>
  );
}
