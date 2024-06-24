import { Form, useFetcher } from "@remix-run/react";
import { useCallback } from "react";

import Button from "~/components/Button/Button";
import Input from "~/components/Input/Input";
import MenubarComponent from "~/components/Menubar/Menubar";
import { useOptionalUser } from "~/utils";

interface HeaderProps {
  hideSearch?: boolean;
}

const UserHeader = ({ hideSearch = false }: HeaderProps) => {
  const user = useOptionalUser();
  const fetcher = useFetcher();

  const getItems = useCallback(() => {
    return [
      {
        text: "Admin panel",
        link: "/admin",
        icon: `🛡️`,
      },
      {
        text: "Logout",
        onClick: () =>
          fetcher.submit({}, { action: "/logout", method: "post" }),
        icon: `👋`,
      },
    ];
  }, [fetcher]);

  return (
    <header className="sticky z-50 top-0 flex gap-2 items-center justify-between bg-slate-800 p-4 text-white">
      <div className="flex items-center justify-center gap-2">
        <Button variant={"secondary-2"} link={{ to: "/" }}>
          Home
        </Button>
      </div>
      <div className="flex items-center justify-between gap-2 w-[400px] md:w-[600px]">
        {!hideSearch ? (
          <Form
            method={"GET"}
            className="flex items-center w-full px-2 gap-2 text-black [&>button]:hidden md:[&>button]:flex"
            action={"search"}
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
              🙎🏻‍♂️
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