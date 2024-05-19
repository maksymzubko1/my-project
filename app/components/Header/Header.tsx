import React from "react";
import { Form, Link, useLocation } from "@remix-run/react";
import { useUser } from "~/utils";
import Button from "~/components/Button/Button";

function getCurrentPage(pathname: string) {
  if(pathname.includes("/admin/posts")){
    return "Posts";
  } else if(pathname.includes("/admin/rss")){
    return "RSS";
  }
}

const Header = () => {
  const user = useUser();
  const location = useLocation();

  const currentPage = getCurrentPage(location.pathname);

  return (
    <header className="flex items-center justify-between bg-slate-800 p-4 text-white">
      <h1 className="text-3xl font-bold">
        <Link to=".">{currentPage}</Link>
      </h1>
      <div className="flex items-center justify-center gap-2">
        <Link to={location.pathname === "/admin/posts" ? "." : "/admin/posts"}>
          Posts page
        </Link>
        <Link to={location.pathname === "/admin/rss" ? "." : "/admin/rss"}>
          RSS page
        </Link>
      </div>
      <Form action="/logout" method="post">
        <Button isSubmit variant={"secondary-2"}>
          Logout
        </Button>
      </Form>
    </header>
  );
};

export default Header;
