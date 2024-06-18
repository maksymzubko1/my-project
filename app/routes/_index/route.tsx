import type { MetaFunction } from "@remix-run/node";

import Button from "~/components/Button/Button";
import { useOptionalUser } from "~/utils";
import UserHeader from "~/components/UserHeader/Header";
import { isRouteErrorResponse, Links, Meta, Scripts, useLoaderData, useRouteError } from "@remix-run/react";

export const meta: MetaFunction = () => [{ title: "Remix Posts" }];

import { loader as routeLoader } from "./loader";
import Post from "~/components/Post/Post";

export const loader = routeLoader;

export default function Index() {
  const user = useOptionalUser();
  const { postListItems } = useLoaderData<typeof loader>();

  console.log(postListItems);

  return (
    <>
      <UserHeader />
      <main className="relative min-h-screen bg-white sm:flex sm:items-center sm:justify-center">
        <section id={"posts-list"} className="flex flex-col gap-[20px] w-[80%] justify-center p-4">
          {postListItems.map(item =>
            <Post {...item} />
          )}
        </section>
      </main>
    </>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();
  return (
    <html>
    <head>
      <title>Oops!</title>
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
        </div>
      </div>
    </div>
    <Scripts />
    </body>
    </html>
  );
}