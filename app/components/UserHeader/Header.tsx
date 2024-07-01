import { ArrowLeftIcon, DashboardIcon, ExitIcon, PersonIcon } from "@radix-ui/react-icons";
import { Form, Link, useFetcher, useLocation } from "@remix-run/react";
import { useCallback } from "react";

import Button from "~/components/Button/Button";
import Input from "~/components/Input/Input";
import MenubarComponent from "~/components/Menubar/Menubar";
import { getSearchParams, useOptionalUser } from "~/utils";

interface HeaderProps {
  hideSearch?: boolean;
}

const UserHeader = ({ hideSearch = false }: HeaderProps) => {
  const user = useOptionalUser();
  const fetcher = useFetcher();
  const location = useLocation();

  const backUrl = getSearchParams(location.search)?.backUrl;

  const getItems = useCallback(() => {
    return [
      {
        text: "Admin panel",
        link: "/admin",
        icon: DashboardIcon,
      },
      {
        text: "Logout",
        onClick: () =>
          fetcher.submit({}, { action: "/logout", method: "post" }),
        icon: ExitIcon,
      },
    ];
  }, [fetcher]);

  return (
    <header className="sticky z-50 top-0 flex gap-2 items-center justify-between bg-slate-800 p-4 text-white">
      <div className="flex items-center justify-center gap-2">
        {backUrl &&
          <Link className={"transition-all flex items-center justify-center h-[42px] py-2 px-1 [&>svg]:w-[20px] [&>svg]:h-[20px] rounded-md border border-transparent text-base font-medium shadow-sm h-full bg-slate-600 text-blue-100 hover:bg-blue-500 active:bg-blue-600"} to={{pathname: backUrl.split('?')[0], search: backUrl.split('?')?.[1] || ""}}>
            <ArrowLeftIcon/>
          </Link>
        }
        <Button variant={"secondary-2"} link={{ to: "/" }}>
          Home
        </Button>
      </div>
      <div className="flex items-center justify-between gap-2 w-[400px] md:w-[600px]">
        {!hideSearch ? (
          <Form
            method={"GET"}
            className="flex items-center w-full px-2 gap-2 text-black [&>button]:hidden md:[&>button]:flex"
            action={"/search"}
          >
            <Input
              fullWidth
              id={"query"}
              name={"query"}
              placeholder={"Search..."}
              inputSettings={{ variant: "input", required: true }}
            />
            <Button variant={"secondary-2"} isSubmit>
              Search
            </Button>
          </Form>
        ) : (
          <div></div>
        )}
        {
          !user ? (
            <Button variant={"secondary-2"} link={{ to: "/login" }}>
              Log In
            </Button>
          ) : (
            <MenubarComponent items={getItems()} id={"user-bar"}>
              <PersonIcon color={"black"} />
            </MenubarComponent>
          )
          // <Button variant={"secondary-2"} link={{ to: "/logout" }}>
          //   Logout
          // </Button>
        }
      </div>
    </header>
  );
};

export default UserHeader;
