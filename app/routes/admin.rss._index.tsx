import { Link } from "@remix-run/react";

export default function PostIndexPage() {
  return (
    <p>
      No rss source selected. Select a rss source on the left, or{" "}
      <Link to="new" className="text-blue-500 underline">
        create a new rss source.
      </Link>
    </p>
  );
}
