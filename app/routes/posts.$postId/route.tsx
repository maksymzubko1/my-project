import type { MetaFunction } from "@remix-run/node";
import {
  isRouteErrorResponse,
  useLoaderData,
  useNavigation,
  useRouteError,
} from "@remix-run/react";

import Spinner from "~/components/Spinner/Spinner";
import UserHeader from "~/components/UserHeader/Header";

import { loader as routeLoader } from "./loader";
import styles from "./styles.module.css";

export const meta: MetaFunction = (args) => {
  return [{ title: `Remix Posts - Post ${args.params.postId}` }];
};

export const loader = routeLoader;

export default function PostPage() {
  const { post } = useLoaderData<typeof loader>();

  const navigation = useNavigation();

  if (navigation.state === "loading") {
    return <Spinner size={"large"} />;
  }

  return (
    <>
      <UserHeader />
      <div className="h-full full-height flex flex-col gap-2 px-4 mt-2 md:px-8 max-w-[1500px] w-full md:w-[80%] mx-auto">
        <h2 className="text-xl">{post.title}</h2>
        <div
          className={`${styles.post}`}
          dangerouslySetInnerHTML={{ __html: post.body }}
        />
      </div>
    </>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();

  if (error instanceof Error) {
    return <div>An unexpected error occurred: {error.message}</div>;
  }

  if (!isRouteErrorResponse(error)) {
    return <h1>Unknown Error</h1>;
  }

  if (error.status === 404) {
    return <div>Post not found</div>;
  }

  return <div>An unexpected error occurred: {error.statusText}</div>;
}