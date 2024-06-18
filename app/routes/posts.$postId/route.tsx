import {
  isRouteErrorResponse,
  useLoaderData,
  useNavigation,
  useRouteError,
} from "@remix-run/react";

import Spinner from "~/components/Spinner/Spinner";

import { loader as routeLoader } from "./loader";

export const loader = routeLoader;

export default function PostPage() {
  const { post } = useLoaderData<typeof loader>();

  const navigation = useNavigation();

  if (navigation.state === "loading") {
    return <Spinner size={"large"} />;
  }

  return (
    <div className="h-full flex-col gap-2">
      <h2 className="text-xl">{post.title}</h2>
      <div dangerouslySetInnerHTML={{__html: post.body}}/>
    </div>
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
