import Button from "~/components/Button/Button";
import { useOptionalUser } from "~/utils";
import Input from "~/components/Input/Input";
import MenubarComponent from "~/components/Menubar/Menubar";
import { useCallback } from "react";
import { useFetcher } from "@remix-run/react";

const UserHeader = () => {
  const user = useOptionalUser();
  const fetcher = useFetcher();

  const getItems = useCallback(() => {
    return [
      {
        text: "Admin panel",
        link: '/admin',
        icon: `🛡️`,
      },
      {
        text: "Logout",
        onClick: () => fetcher.submit({}, {action: "/logout", method: "post"}),
        icon: `👋`,
      },
    ]
  }, []);

  return (
    <header className="sticky z-50 top-0 flex gap-2 items-center justify-between bg-slate-800 p-4 text-white">
      <div className="flex items-center justify-center gap-2">
        <Button variant={"secondary-2"} link={{ to: "/" }}>
          Home
        </Button>
      </div>
      <div className="flex items-center  gap-2 w-[400px] md:w-[600px]">
        <Input
          fullWidth
          id={"query"}
          name={"query"}
          placeholder={"Search..."}
          inputSettings={{ variant: "input" }}
        />
        {!user ?
          <Button variant={"secondary-2"} link={{ to: "/login" }}>
            Log In
          </Button>
          :
          <MenubarComponent items={getItems()} id={"user-bar"}>
            🙎🏻‍♂️
          </MenubarComponent>
          // <Button variant={"secondary-2"} link={{ to: "/logout" }}>
          //   Logout
          // </Button>
        }
      </div>
    </header>
  );
};

export default UserHeader;
