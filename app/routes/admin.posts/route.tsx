import { GearIcon } from "@radix-ui/react-icons";
import type { MetaFunction } from "@remix-run/node";
import { Link, Outlet, useFetcher, useLoaderData } from "@remix-run/react";
import { useCallback, useState } from "react";

import Button from "~/components/Button/Button";
import Header from "~/components/Header/Header";
import Input from "~/components/Input/Input";
import MenubarComponent from "~/components/Menubar/Menubar";
import DeletePostModal from "~/components/Modal/DeletePostModal";
import Select from "~/components/Select";
import useModal from "~/hooks/useModal";
import { useToast } from "~/hooks/useToast";
import {
  generateItems,
  getIcon,
  Sort,
  sortOptions,
} from "~/routes/admin.posts/utils";

import { loader as routeLoader } from "./loader";

export const loader = routeLoader;

export const meta: MetaFunction = () => [{ title: "Admin - Posts page" }];

export default function PostsPage() {
  const { postListItems } = useLoaderData<typeof loader>();
  const fetcher = useFetcher();
  const [sort, setSort] = useState<Sort>(Sort.DATE_CREATE_DESC);
  const [selectedPost, setSelectedPost] = useState<string>(null);

  const { isOpened, handleToggleModal } = useModal({});

  const handleDelete = useCallback(() => {
    fetcher.submit({}, { action: `${selectedPost}/delete`, method: "post" });
    handleToggleModal();
  }, [handleToggleModal, selectedPost, fetcher]);

  const action = useCallback(
    (
      action: "HIDE" | "SHOW" | "DELETE" | "SOFT_DELETE" | "RESTORE",
      id: string,
    ) => {
      switch (action) {
        case "DELETE":
          setSelectedPost(id);
          handleToggleModal();
          break;
        case "HIDE":
          fetcher.submit({}, { action: `${id}/hide`, method: "post" });
          break;
        case "SHOW":
          fetcher.submit({}, { action: `${id}/show`, method: "post" });
          break;
        case "SOFT_DELETE":
          fetcher.submit({}, { action: `${id}/soft_delete`, method: "post" });
          break;
        case "RESTORE":
          fetcher.submit({}, { action: `${id}/restore`, method: "post" });
          break;
      }
    },
    [fetcher, handleToggleModal],
  );

  useToast(fetcher.data);

  const handleChangeSort = useCallback((value: string) => {
    setSort(value as Sort);
  }, []);

  return (
    <div className="flex h-full min-h-screen flex-col">
      <Header />
      <main className="flex absolute pt-[72px] w-full box-border h-full bg-white">
        <div className="h-full w-80 border-r bg-gray-50">
          <Link
            to="new"
            className="block p-4 text-xl text-blue-500 hover:bg-blue-50 transition-all"
          >
            + New Post
          </Link>

          <hr className="mb-3" />

          <fetcher.Form
            method={"GET"}
            className="flex mb-3 items-center w-full max-w-sm px-2 gap-2"
          >
            <Input
              id={"query"}
              name={"query"}
              placeholder={"Input name, tag or part of text for search..."}
              inputSettings={{ variant: "input" }}
            />
            <Select
              name={"sortBy"}
              disableFilter
              label={""}
              items={sortOptions}
              value={sort}
              onChange={handleChangeSort}
              showSelected={false}
            />
            <Button
              loading={fetcher.state === "loading"}
              variant={"secondary-2"}
              isSubmit
            >
              Search
            </Button>
          </fetcher.Form>

          {(fetcher.data?.postListItems || postListItems).length === 0 ? (
            <p className="p-4">No posts yet</p>
          ) : (
            <ol className="overflow-y-auto h-full flex flex-col">
              {(fetcher.data?.postListItems || postListItems).map((post) => {
                const Icon = getIcon(post.status, post.isDeleted);
                return (
                  <li key={post.id}>
                    <div className="flex items-center gap-3 justify-between border-b p-4 text-xl">
                      <span className="flex min-w-[0] items-center gap-2 w-full [&>svg]:shrink-0">
                        <Icon />
                        <span className="truncate">{`${post.title}`}</span>
                      </span>
                      <MenubarComponent
                        id={post.id}
                        items={generateItems(post, action)}
                      >
                        <GearIcon />
                      </MenubarComponent>
                    </div>
                  </li>
                );
              })}
            </ol>
          )}
        </div>

        <div className="flex-1 p-6 h-full overflow-y-auto">
          <Outlet />
        </div>

        <DeletePostModal
          isLoading={fetcher.state === "loading"}
          isOpened={isOpened}
          handleClose={handleToggleModal}
          handleSubmit={handleDelete}
        />
      </main>
    </div>
  );
}
