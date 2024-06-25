import { Link } from "@remix-run/react";

export default function MixinIndexPage() {
  return (
    <p>
      No mixin selected. Select a mixin on the left, or{" "}
      <Link to="new" className="text-blue-500 underline">
        create a new mixin source.
      </Link>
    </p>
  );
}
