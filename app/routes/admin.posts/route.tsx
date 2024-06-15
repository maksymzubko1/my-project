import type { MetaFunction } from "@remix-run/node";
import { Link, Outlet, useFetcher, useLoaderData } from "@remix-run/react";

import Header from "~/components/Header/Header";
import { useCallback, useState } from "react";
import { Post } from "@prisma/client";
import MenubarComponent, { MenubarItem } from "~/components/MenuIcon/MenuIcon";
import { useToast } from "~/hooks/useToast";
import { Button } from "~/components/shadcn/ui/button";
import Input from "~/components/Input/Input";
import Select from "~/components/Select";

import { loader as routeLoader } from "./loader";

export const loader = routeLoader;

export const meta: MetaFunction = () => [{ title: "Admin - Posts page" }];

enum Sort {
  ID_ASC = "id_asc",
  ID_DESC = "id_desc",
  DATE_ASC = "date_asc",
  DATE_DESC = "date_desc",
  NAME_ASC = "name_asc",
  NAME_DESC = "name_desc",
}

const sortOptions = [
  {
    id: "0",
    value: "id_asc",
    label: "ID ⬇"
  },
  {
    id: "1",
    value: "id_desc",
    label: "ID ⬆"
  },
  {
    id: "2",
    value: "date_asc",
    label: "Date ⬇"
  },
  {
    id: "3",
    value: "date_desc",
    label: "Date ⬆"
  },
  {
    id: "4",
    value: "name_asc",
    label: "Title ⬇"
  },
  {
    id: "5",
    value: "name_desc",
    label: "Title ⬆"
  }
];

export default function PostsPage() {
  const { postListItems } = useLoaderData<typeof loader>();
  const fetcher = useFetcher();
  const [currentEditing, setCurrentEditing] = useState<{ id: string; }>(null);
  const [sort, setSort] = useState<Sort>(Sort.ID_ASC);

  const action = useCallback((action: "HIDE" | "SHOW" | "DELETE" | "SOFT_DELETE" | "RESTORE", id: string) => {
    switch (action) {
      case "DELETE":
        fetcher.submit({}, { action: `${id}/delete`, method: "post" });
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
  }, [fetcher]);

  useToast(fetcher.data);

  const handleChangeSort = useCallback((value: string) => {
    setSort(value as Sort);
  }, []);

  const generateItems = useCallback((post: Pick<Post, "id" | "status" | "title" | "isDeleted">) => {
    const menuItems: MenubarItem[] = [
      {
        text: post.status === "DRAFTED" ? "Complete creating" : "Edit",
        link: `${post.id}`,
        icon: post.status === "DRAFTED" ? `👌` : `✏`
      },
    ];

    if(post.status === "HIDDEN"){
      menuItems.push({
        text: "Make visible",
        onClick: () => action("SHOW", post.id),
        icon: `👁`
      })
    }

    if(post.status === "DEFAULT") {
      menuItems.push({ text: "Hide", onClick: () => action("HIDE", post.id), icon: `🙈` })
    }

    if(post.isDeleted){
      menuItems.push({
        text: "Restore",
        onClick: () => action("RESTORE", post.id),
        icon: `↪️`,
        tooltip: "The post will be restored"
      })
    }

    if(!post.isDeleted && post.status !== "DRAFTED"){
      menuItems.push({
        text: "Archive",
        tooltip: "The post will not be available to users, but you can restore it at any time",
        onClick: () => action("SOFT_DELETE", post.id),
        icon: `📦`
      })
    }

    menuItems.push({
      text: "Delete",
      onClick: () => action("DELETE", post.id),
      icon: "🗑️",
      tooltip: "The post will be deleted permanently"
    })

    return menuItems;
  }, []);

  return (
    <div className="flex h-full min-h-screen flex-col">
      <Header />
      <main className="flex h-full bg-white">
        <div className="h-full w-80 border-r bg-gray-50">
          <Link to="new" className="block p-4 text-xl text-blue-500">
            + New Post
          </Link>

          <hr className="mb-3" />

          <fetcher.Form method={"GET"} className="flex items-center w-full max-w-sm px-2 gap-2">
            <Input id={"query"} name={"query"} placeholder={"Input name, tag or part of text for search..."}
                   inputSettings={{ variant: "input" }} />
            <Select
              name={"sortBy"}
              disableFilter
              label={""}
              items={sortOptions}
              value={sort}
              onChange={handleChangeSort}
              showSelected={false}
            />
            <Button type="submit">Search</Button>
          </fetcher.Form>

          {(fetcher.data?.postListItems || postListItems).length === 0 ? (
            <p className="p-4">No posts yet</p>
          ) : (
            <ol>
              {(fetcher.data?.postListItems || postListItems).map((post) => (
                <li key={post.id}>
                  <div className="flex items-center gap-3 justify-between border-b p-4 text-xl">
                    <span className="truncate">{`📝 ${post.title}`}</span>
                    <MenubarComponent id={post.id} items={generateItems(post)}>⚙</MenubarComponent>
                  </div>
                </li>
              ))}
            </ol>
          )}
        </div>

        <div className="flex-1 p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
