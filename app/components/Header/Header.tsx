import { Form, Link, useLocation } from "@remix-run/react";

import Button from "~/components/Button/Button";
import { useUser } from "~/utils";

function getCurrentPage(pathname: string) {
  if (pathname.includes("/admin/posts")) {
    return "Posts";
  } else if (pathname.includes("/admin/rss")) {
    return "RSS";
  }
}

const Header = () => {
  useUser();
  const location = useLocation();

  const currentPage = getCurrentPage(location.pathname);

  return (
    <header className="sticky z-50 top-0 flex items-center justify-between bg-slate-800 p-4 text-white">
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
      <div className="flex gap-2 items-center">
        <Form action="/" method="get">
          <Button isSubmit variant={"secondary-2"}>
            Home
          </Button>
        </Form>
        <Form action="/logout" method="post">
          <Button isSubmit variant={"secondary-2"}>
            Logout
          </Button>
        </Form>
      </div>
    </header>
  );
};

export default Header;
