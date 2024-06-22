import {
  MemoryUploadHandlerOptions,
  UploadHandler,
  UploadHandlerPart,
} from "@remix-run/node";
import { useMatches } from "@remix-run/react";
import { useMemo } from "react";

import type { User } from "~/models/user.server";

const DEFAULT_REDIRECT = "/";

/**
 * This should be used any time the redirect path is user-provided
 * (Like the query string on our login/signup pages). This avoids
 * open-redirect vulnerabilities.
 * @param {string} to The redirect destination
 * @param {string} defaultRedirect The redirect to use if the to is unsafe.
 */
export function safeRedirect(
  to: FormDataEntryValue | string | null | undefined,
  defaultRedirect: string = DEFAULT_REDIRECT,
) {
  if (!to || typeof to !== "string") {
    return defaultRedirect;
  }

  if (!to.startsWith("/") || to.startsWith("//")) {
    return defaultRedirect;
  }

  return to;
}

/**
 * This base hook is used in other hooks to quickly search for specific data
 * across all loader data using useMatches.
 * @param {string} id The route id
 * @returns {JSON|undefined} The router data or undefined if not found
 */
export function useMatchesData(
  id: string,
): Record<string, unknown> | undefined {
  const matchingRoutes = useMatches();
  const route = useMemo(
    () => matchingRoutes.find((route) => route.id === id),
    [matchingRoutes, id],
  );
  return route?.data as Record<string, unknown>;
}

function isUser(user: unknown): user is User {
  return (
    user != null &&
    typeof user === "object" &&
    "email" in user &&
    typeof user.email === "string"
  );
}

export function useOptionalUser(): User | undefined {
  const data = useMatchesData("root");
  if (!data || !isUser(data.user)) {
    return undefined;
  }
  return data.user;
}

export function useUser(): User {
  const maybeUser = useOptionalUser();
  if (!maybeUser) {
    throw new Error(
      "No user found in root loader, but user is required by useUser. If user is optional, try useOptionalUser instead.",
    );
  }
  return maybeUser;
}

export function getMinutesFromInterval(interval: string) {
  switch (interval) {
    case "everyMinute":
      return 1;
    case "every5Minute":
      return 5;
    case "every15Minute":
      return 15;
    case "every30Minute":
      return 30;
    case "everyHour":
      return 60;
    case "every4Hour":
      return 60 * 4;
    case "everyDay":
      return 60 * 24;
    default:
      return 0;
  }
}

export function validateEmail(email: unknown): email is string {
  return typeof email === "string" && email.length > 3 && email.includes("@");
}

export async function asyncIterableToFile(
  asyncIterable: AsyncIterable<Uint8Array>,
  fileName: string,
  fileType: string,
): Promise<File> {
  const chunks: Uint8Array[] = [];

  for await (const chunk of asyncIterable) {
    chunks.push(chunk);
  }

  const blob = new Blob(chunks, { type: fileType });

  const file = new File([blob as BlobPart], fileName, { type: fileType });

  return file;
}

export function isEmpty(value: string | string[] | object | null | undefined) {
  if (value === null || value === undefined) {
    return true;
  }

  if (Array.isArray(value) || typeof value === "string") {
    return value.length === 0;
  }

  if (typeof value === "object") {
    return JSON.stringify(value) === JSON.stringify({});
  }

  return false;
}

export function getSearchParams(
  searchString: string,
): Record<string, string | undefined> {
  const searchParams = new URLSearchParams(searchString);
  const params: Record<string, string | undefined> = {};

  for (const [key, value] of searchParams.entries()) {
    params[key] = value;
  }

  return params;
}

export function createCustomMemoryUploadHandler({
  filter,
  maxPartSize = 3000000,
}: MemoryUploadHandlerOptions = {}): UploadHandler {
  return async ({ filename, contentType, name, data }: UploadHandlerPart) => {
    if (
      filter &&
      !(await filter({
        filename,
        contentType,
        name,
      }))
    ) {
      return undefined;
    }
    let size = 0;
    const chunks = [];
    for await (const chunk of data) {
      size += chunk.byteLength;
      if (size > maxPartSize) {
        return "error: file too large";
      }
      chunks.push(chunk);
    }
    if (typeof filename === "string") {
      return new File(chunks, filename, {
        type: contentType,
      });
    }
    return await new Blob(chunks, {
      type: contentType,
    }).text();
  };
}
