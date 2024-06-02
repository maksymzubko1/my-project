import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, NavLink, Outlet, useLoaderData } from "@remix-run/react";

import { getPostListItems } from "~/models/posts.server";
import { requireUserId } from "~/session.server";
import Header from "~/components/Header/Header";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const userId = await requireUserId(request);
  const postListItems = await getPostListItems();
  return json({ postListItems });
};

export const meta: MetaFunction = () => [{ title: "Admin - Posts page" }];

export default function PostsPage() {
  const data = useLoaderData<typeof loader>();

  return (
    <div className="flex h-full min-h-screen flex-col">
      <Header />
      <main className="flex h-full bg-white">
        <div className="h-full w-80 border-r bg-gray-50">
          <Link to="new" className="block p-4 text-xl text-blue-500">
            + New Post
          </Link>

          <hr />

          {data.postListItems.length === 0 ? (
            <p className="p-4">No posts yet</p>
          ) : (
            <ol>
              {data.postListItems.map((post) => (
                <li key={post.id}>
                  <NavLink
                    className={({ isActive }) =>
                      `block border-b p-4 text-xl ${isActive ? "bg-white" : ""}`
                    }
                    to={post.id}
                  >
                    📝 {post.title}
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
