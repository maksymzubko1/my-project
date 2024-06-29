import { GearIcon } from "@radix-ui/react-icons";
import type { MetaFunction } from "@remix-run/node";
import { Link, Outlet, useFetcher, useLoaderData } from "@remix-run/react";
import { useCallback, useState } from "react";

import Button from "~/components/Button/Button";
import Header from "~/components/Header/Header";
import Input from "~/components/Input/Input";
import MenubarComponent from "~/components/Menubar/Menubar";
import DeleteRSSModal from "~/components/Modal/DeleteRssModal";
import Select from "~/components/Select";
import useModal from "~/hooks/useModal";
import { useToast } from "~/hooks/useToast";
import { loader as routeLoader } from "~/routes/admin.rss/loader";
import {
  generateItems,
  getIcon,
  Sort,
  sortOptions,
} from "~/routes/admin.rss/utils";

export const loader = routeLoader;

export const meta: MetaFunction = () => [{ title: "Admin - RSS page" }];

export default function RssPage() {
  const { rssListItems } = useLoaderData<typeof loader>();
  const fetcher = useFetcher();
  const [sort, setSort] = useState<Sort>(Sort.DATE_CREATE_DESC);
  const [selectedRSS, setSelectedRSS] = useState<string>(null);

  const { isOpened, handleToggleModal } = useModal({});

  const handleDelete = useCallback(() => {
    fetcher.submit({}, { action: `${selectedRSS}/delete`, method: "post" });
    handleToggleModal();
  }, [handleToggleModal, selectedRSS, fetcher]);

  const action = useCallback(
    (action: "RESUME" | "PAUSE" | "DELETE", id: string) => {
      switch (action) {
        case "DELETE":
          setSelectedRSS(id);
          handleToggleModal();
          break;
        case "RESUME":
          fetcher.submit({}, { action: `${id}/resume`, method: "post" });
          break;
        case "PAUSE":
          fetcher.submit({}, { action: `${id}/pause`, method: "post" });
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
            + New Rss
          </Link>

          <hr className="mb-3" />

          <fetcher.Form
            method={"GET"}
            className="flex mb-3 items-center w-full max-w-sm px-2 gap-2"
          >
            <Input
              id={"query"}
              name={"query"}
              placeholder={"Input name for search..."}
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
            <Button variant={"secondary-2"} isSubmit>
              Search
            </Button>
          </fetcher.Form>

          {(fetcher.data?.rssListItems || rssListItems).length === 0 ? (
            <p className="p-4">No rss yet</p>
          ) : (
            <ol className="overflow-y-auto flex flex-col h-full">
              {(fetcher.data?.rssListItems || rssListItems).map((rss) => {
                const Icon = getIcon(rss.isPaused);
                return (
                  <li key={rss.id}>
                    <div className="flex items-center gap-3 justify-between border-b p-4 text-xl">
                      <span className="flex min-w-[0] items-center gap-2 w-full [&>svg]:shrink-0">
                        <Icon />
                        <span className="truncate">{`${rss.name}`}</span>
                      </span>
                      <MenubarComponent
                        id={rss.id}
                        items={generateItems(rss, action)}
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

        <DeleteRSSModal
          isLoading={fetcher.state === "loading"}
          isOpened={isOpened}
          handleClose={handleToggleModal}
          handleSubmit={handleDelete}
        />
      </main>
    </div>
  );
}
