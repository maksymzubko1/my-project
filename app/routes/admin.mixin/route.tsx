import { GearIcon } from "@radix-ui/react-icons";
import type { MetaFunction } from "@remix-run/node";
import { Link, Outlet, useFetcher, useLoaderData } from "@remix-run/react";
import { useCallback, useState } from "react";

import Button from "~/components/Button/Button";
import Header from "~/components/Header/Header";
import Input from "~/components/Input/Input";
import MenubarComponent from "~/components/Menubar/Menubar";
import DeleteMixinModal from "~/components/Modal/DeleteMixinModal";
import UpdateMixinModal from "~/components/Modal/UpdateMixinModal";
import Select from "~/components/Select";
import useModal from "~/hooks/useModal";
import { useToast } from "~/hooks/useToast";
import { action as routeAction } from "~/routes/admin.mixin/action";
import { loader as routeLoader } from "~/routes/admin.mixin/loader";
import {
  generateItems,
  Sort,
  sortOptions,
  getIcon,
} from "~/routes/admin.mixin/utils";

export const loader = routeLoader;
export const action = routeAction;

export const meta: MetaFunction = () => [{ title: "Admin - Mixin page" }];

export default function MixinPage() {
  const { mixinListItems, mixinSettings } = useLoaderData<typeof loader>();

  const fetcher = useFetcher();

  const [sort, setSort] = useState<Sort>(Sort.DATE_CREATE_DESC);
  const [selectedMixin, setSelectedMixin] = useState<string>(null);

  const {
    isOpened: isOpenedSettings,
    handleToggleModal: handleToggleModalSettings,
  } = useModal({});
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
          <div className="w-full flex items-center gap-2 justify-between px-4 py-2">
            <Link
              to="new"
              className="block text-xl h-full py-3 text-blue-500 hover:bg-blue-50 transition-all flex-1"
            >
              + New Mixin
            </Link>
            <Button onClick={handleToggleModalSettings} variant={"primary"}>
              <GearIcon />
            </Button>
          </div>
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
              {(fetcher.data?.mixinListItems || mixinListItems).map((mixin) => {
                const Icon = getIcon(mixin.draft);
                return (
                  <li key={mixin.id}>
                    <div className="flex items-center gap-3 justify-between border-b p-4 text-xl">
                      <span className="flex min-w-[0] items-center gap-2 w-full [&>svg]:shrink-0">
                        <Icon />
                        <span className="truncate">{`${mixin.name}`}</span>
                      </span>
                      <MenubarComponent
                        id={mixin.id}
                        items={generateItems(mixin, action)}
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

        <DeleteMixinModal
          isLoading={fetcher.state === "loading"}
          isOpened={isOpened}
          handleClose={handleToggleModal}
          handleSubmit={handleDelete}
        />

        <UpdateMixinModal
          isOpened={isOpenedSettings}
          handleClose={handleToggleModalSettings}
          initialData={mixinSettings}
        />
      </main>
    </div>
  );
}
