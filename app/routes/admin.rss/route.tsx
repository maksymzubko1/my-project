import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, NavLink, Outlet, useLoaderData } from "@remix-run/react";

import { requireUserId } from "~/session.server";
import Header from "~/components/Header/Header";
import { getRssListItems } from "~/models/rss.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const userId = await requireUserId(request);
  const rssListItems = await getRssListItems();
  return json({ rssListItems });
};

export const meta: MetaFunction = () => [{ title: "Admin - RSS sources page" }];

export default function PostsPage() {
  const {rssListItems} = useLoaderData<typeof loader>();

  return (
    <div className="flex h-full min-h-screen flex-col">
      <Header />
      <main className="flex h-full bg-white">
        <div className="h-full w-80 border-r bg-gray-50">
          <Link to="new" className="block p-4 text-xl text-blue-500">
            + New Rss source
          </Link>

          <hr />

          {rssListItems.length === 0 ? (
            <p className="p-4">No rss sources yet</p>
          ) : (
            <ol>
              {rssListItems.map((rss) => (
                <li key={rss.id}>
                  <NavLink
                    className={({ isActive }) =>
                      `block border-b p-4 text-xl ${isActive ? "bg-white" : ""}`
                    }
                    to={rss.id}
                  >
                    📝 {rss.title}
                  </NavLink>
                </li>
              ))}
            </ol>
          )}
        </div>

        <div className="flex-1 p-6">
            <Outlet />
        </div>
      </main>
    </div>
  );
}
