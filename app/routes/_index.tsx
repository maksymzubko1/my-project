import type { MetaFunction } from "@remix-run/node";

import { useOptionalUser } from "~/utils";
import Button from "~/components/Button/Button";

export const meta: MetaFunction = () => [{ title: "Remix Posts" }];

export default function Index() {
  const user = useOptionalUser();

  return (
    <main className="relative min-h-screen bg-white sm:flex sm:items-center sm:justify-center">
      {user ? (
        <Button variant={"primary"} link={{ to: "/admin/posts" }}>
          View Posts
        </Button>
      ) : (
        <div className="space-y-4 sm:mx-auto sm:inline-grid sm:grid-cols-2 sm:gap-5 sm:space-y-0">
          <Button variant={"secondary-2"} link={{ to: "/join" }}>
            Sign up
          </Button>
          <Button variant={"primary"} link={{ to: "/login" }}>
            Log In
          </Button>
        </div>
      )}
    </main>
  );
}
