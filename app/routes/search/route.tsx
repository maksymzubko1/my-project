import type { MetaFunction } from "@remix-run/node";
import { Form, useLoaderData, useLocation } from "@remix-run/react";

import Button from "~/components/Button/Button";
import Input from "~/components/Input/Input";
import Pagination from "~/components/Pagination/Pagination";
import Post from "~/components/Post/Post";
import UserHeader from "~/components/UserHeader/Header";
import { getSearchParams } from "~/utils";

import { loader as routeLoader } from "./loader";

export const meta: MetaFunction = () => [{ title: "Remix Posts - Search" }];

export const loader = routeLoader;

export default function Index() {
  const { items, totalPages, currentPage, hasPrev, hasNext } =
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
          <section
            id={"posts-list"}
            className="flex flex-col gap-[20px] w-full justify-center p-4"
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
