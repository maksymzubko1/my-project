import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction,
} from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, Link, useActionData, useSearchParams } from "@remix-run/react";

import Button from "~/components/Button/Button";
import HiddenInput from "~/components/Input/HiddenInput";
import Input from "~/components/Input/Input";
import useFormLoading from "~/hooks/useFormLoading";
import { verifyLogin } from "~/models/user.server";
import { createUserSession, getUserId } from "~/session.server";
import { safeRedirect, validateEmail } from "~/utils";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const userId = await getUserId(request);
  if (userId) return redirect("/");
  return json({});
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const email = formData.get("email");
  const password = formData.get("password");
  const redirectTo = safeRedirect(formData.get("redirectTo"), "/");
  const remember = formData.get("remember");

  if (!validateEmail(email)) {
    return json(
      { errors: { email: "Email is invalid", password: null } },
      { status: 400 },
    );
  }

  if (typeof password !== "string" || password.length === 0) {
    return json(
      { errors: { email: null, password: "Password is required" } },
      { status: 400 },
    );
  }

  if (password.length < 8) {
    return json(
      { errors: { email: null, password: "Password is too short" } },
      { status: 400 },
    );
  }

  const user = await verifyLogin(email, password);

  if (!user) {
    return json(
      { errors: { email: "Invalid email or password", password: null } },
      { status: 400 },
    );
  }

  return createUserSession({
    redirectTo,
    remember: remember === "on",
    request,
    userId: user.id,
  });
};

export const meta: MetaFunction = () => [
  {
    title: "Login Page - Remix News",
    description: "Log in to access exclusive content and features.",
    keywords: "login, sign in, user login, secure login",
  },
];

export default function LoginPage() {
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") || "/admin/posts";
  const actionData = useActionData<typeof action>();
  const isLoading = useFormLoading();

  return (
    <div className="flex min-h-full flex-col justify-center">
      <div className="mx-auto w-full max-w-md px-8">
        <Form method="post" className="space-y-6">
          <Input
            name={"email"}
            inputSettings={{
              type: "email",
              autoComplete: "email",
              variant: "input",
              autoFocus: true,
              required: true,
            }}
            fullWidth
            id={"email"}
            label={"Email address"}
            error={actionData?.errors?.email}
          />

          <Input
            name={"password"}
            inputSettings={{
              type: "password",
              autoComplete: "current-password",
              variant: "input",
              required: true,
            }}
            fullWidth
            id={"email"}
            label={"Password"}
            error={actionData?.errors?.password}
          />

          <HiddenInput name={"redirectTo"} value={redirectTo} />

          <Button loading={isLoading} fullWidth variant={"primary"} isSubmit>
            Log in
          </Button>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember"
                name="remember"
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label
                htmlFor="remember"
                className="ml-2 block text-sm text-gray-900"
              >
                Remember me
              </label>
            </div>
            <div className="text-center text-sm text-gray-500">
              Don&apos;t have an account?{" "}
              <Link
                className="text-blue-500 underline"
                to={{
                  pathname: "/join",
                  search: searchParams.toString(),
                }}
              >
                Sign up
              </Link>
            </div>
          </div>
        </Form>
      </div>
    </div>
  );
}
