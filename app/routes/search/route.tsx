import type { MetaFunction } from "@remix-run/node";
import { Form, useLoaderData, useLocation } from "@remix-run/react";

import Button from "~/components/Button/Button";
import Input from "~/components/Input/Input";
import Pagination from "~/components/Pagination/Pagination"
import UserHeader from "~/components/UserHeader/Header";
import { getSearchParams } from "~/utils";

import { loader as routeLoader } from "./loader";
import PostsWithMixins from "~/components/PostsWithMixins/PostWithMixins";

export const meta: MetaFunction = () => [{ title: "Remix Posts - Search" }];

export const loader = routeLoader;

export default function Index() {
  const { items, mixin, totalPages, currentPage, hasPrev, hasNext } =
    useLoaderData<typeof loader>();

  const location = useLocation();
  const query = getSearchParams(location.search)?.query;

  return (
    <>
      <UserHeader hideSearch />
      <main className="absolute top-0 pt-[72px] w-full min-h-screen h-full bg-white pb-3 overflow-y-auto">
        <div className="w-full md:w-[80%] max-w-[1500px] h-auto mx-auto flex flex-col items-center">
          <Form
            method={"GET"}
            className="flex items-center w-full px-4 gap-2 text-black my-5"
          >
            <Input
              fullWidth
              id={"query"}
              name={"query"}
              initialValue={query || ""}
              placeholder={"Search..."}
              inputSettings={{ variant: "input" }}
            />
            <Button variant={"secondary-2"} isSubmit>
              Search
            </Button>
          </Form>
          {query ? (
            <h2 className={"font-semibold w-full px-4 text-start text-lg"}>
              Search result for: {query}
            </h2>
          ) : null}
          <PostsWithMixins
            posts={items}
            mixins={mixin}
          />
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
