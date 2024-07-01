import { redirect } from "@remix-run/node";
import {
  isRouteErrorResponse,
  Links,
  Meta,
  Scripts,
  useRouteError,
} from "@remix-run/react";

import Button from "~/components/Button/Button";

export const loader = async () => {
  return redirect("/admin/posts");
};

export function ErrorBoundary() {
  const error = useRouteError();
  return (
    <html lang={"en"}>
      <head>
        <title>Oops!</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <meta
          name="description"
          content="The latest news on your website. Stay updated with the latest events."
        />
        <meta
          name="keywords"
          content="news, latest news, events, breaking news, global news"
        />
        <meta name="robots" content="index, follow" />
        <meta name="author" content="Maksym Zubko" />
        <Meta />
        <Links />
      </head>
      <body>
        <div className="flex h-[100dvh] flex-col items-center justify-center gap-3">
          <div className="rounded bg-gray-50 flex flex-col gap-3 p-6 max-w-lg">
            <h1 className="text-center font-bold">
              {isRouteErrorResponse(error)
                ? `${error.status} ${error.statusText}`
                : error instanceof Error
                  ? error.message
                  : "Unknown Error"}
            </h1>
            <div className="flex gap-2 items-center">
              <Button variant={"primary"} link={{ to: "/" }}>
                Go home
              </Button>
              <Button variant={"primary"} link={{ to: "/admin" }}>
                Go admin dashboard
              </Button>
            </div>
          </div>
        </div>
        <Scripts />
      </body>
    </html>
  );
}
