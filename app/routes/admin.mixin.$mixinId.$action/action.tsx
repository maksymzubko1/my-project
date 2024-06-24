import type { ActionFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import invariant from "tiny-invariant";

import { deleteMixin, getMixin } from "~/models/mixin.server";
import { requireUserId } from "~/session.server";

export const action = async ({ params, request }: ActionFunctionArgs) => {
  await requireUserId(request);
  invariant(params.mixinId, "mixinId not found");

  const mixin = await getMixin({ id: params.mixinId });

  if (!mixin) {
    return json(
      { status: "error", message: "Not found mixin" },
      { status: 404 },
    );
  }

  const action = params.action;

  if (!action || !["delete"].includes(action)) {
    return json(
      { status: "error", message: "Incorrect params" },
      { status: 400 },
    );
  }

  try {
    switch (action) {
      case "delete":
        await deleteMixin({ id: params.mixinId });
        return json(
          { status: "success", message: "Mixin has been deleted" },
          { status: 200 },
        );
    }
  } catch (e) {
    return json(
      { status: "error", message: e.message || "Unexpected error" },
      { status: 500 },
    );
  }
};
