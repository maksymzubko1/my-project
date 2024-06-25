import type { MetaFunction } from "@remix-run/node";
import { Link, Outlet, useFetcher, useLoaderData } from "@remix-run/react";
import { useCallback, useState } from "react";

import Button from "~/components/Button/Button";
import Header from "~/components/Header/Header";
import Input from "~/components/Input/Input";
import MenubarComponent from "~/components/Menubar/Menubar";
import DeleteMixinModal from "~/components/Modal/DeleteMixinModal";
import Select from "~/components/Select";
import useModal from "~/hooks/useModal";
import { useToast } from "~/hooks/useToast";
import { loader as routeLoader } from "~/routes/admin.mixin/loader";
import {
  generateItems,
  Sort,
  sortOptions,
  getIcon,
} from "~/routes/admin.mixin/utils";

export const loader = routeLoader;

export const meta: MetaFunction = () => [{ title: "Admin - Mixin page" }];

export default function MixinPage() {
  const { mixinListItems } = useLoaderData<typeof loader>();
  const fetcher = useFetcher();
  const [sort, setSort] = useState<Sort>(Sort.DATE_CREATE_DESC);
  const [selectedMixin, setSelectedMixin] = useState<string>(null);

  const { isOpened, handleToggleModal } = useModal({});

  const handleDelete = useCallback(() => {
    fetcher.submit({}, { action: `${selectedMixin}/delete`, method: "post" });
    handleToggleModal();
  }, [handleToggleModal, selectedMixin, fetcher]);

  const action = useCallback(
    (action: "RESUME" | "PAUSE" | "DELETE", id: string) => {
      switch (action) {
        case "DELETE":
          setSelectedMixin(id);
          handleToggleModal();
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
            + New Mixin
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

          {(fetcher.data?.mixinListItems || mixinListItems).length === 0 ? (
            <p className="p-4">No mixin yet</p>
          ) : (
            <ol className="overflow-y-auto flex flex-col h-full">
              {(fetcher.data?.mixinListItems || mixinListItems).map((mixin) => (
                <li key={mixin.id}>
                  <div className="flex items-center gap-3 justify-between border-b p-4 text-xl">
                    <span className="truncate">{`${getIcon(mixin.draft)} ${mixin.name}`}</span>
                    <MenubarComponent
                      id={mixin.id}
                      items={generateItems(mixin, action)}
                    >
                      ⚙
                    </MenubarComponent>
                  </div>
                </li>
              ))}
            </ol>
          )}
        </div>

        <div className="flex-1 p-6 h-full overflow-y-auto">
          <Outlet />
        </div>

        <DeleteMixinModal
          isLoading={fetcher.state === "loading"}
          isOpened={isOpened}
          handleClose={handleToggleModal}
          handleSubmit={handleDelete}
        />
      </main>
    </div>
  );
}
