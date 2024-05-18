import React from "react";
import { Form, Link, useLocation } from "@remix-run/react";
import { useUser } from "~/utils";

function getCurrentPage(pathname: string) {
  switch (pathname) {
    case "/admin/posts":
      return "Posts";
    case "/admin/rss":
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
        <button
          type="submit"
          className="rounded bg-slate-600 px-4 py-2 text-blue-100 hover:bg-blue-500 active:bg-blue-600"
        >
          Logout
        </button>
      </Form>
    </header>
  );
};

export default Header;
