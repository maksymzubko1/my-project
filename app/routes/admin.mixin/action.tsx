import type {
  ActionFunctionArgs,
} from "@remix-run/node";
import {
  json,
} from "@remix-run/node";

import { createOrUpdateSettings } from "~/models/mixin.server";
import { requireUserId } from "~/session.server";
import { isEmpty } from "~/utils";

export const action = async ({ request }: ActionFunctionArgs) => {
  await requireUserId(request);

  console.log('action');
  const formData = await request.formData();

  const maxPerList = 10;
  const maxPerSearch = 10;

  const mixinPerList = formData.get("mixinPerList") as string;
  const mixinPerSearch = formData.get("mixinPerSearch") as string;

  let errors = {};

  if (isEmpty(mixinPerList)) {
    errors = { ...errors, mixinPerList: "mixinPerList is required" };
  }

  if (isEmpty(mixinPerSearch)) {
    errors = { ...errors, mixinPerSearch: "mixinPerSearch is required" };
  }

  const intMixinPerList = parseInt(mixinPerList);
  const intMixinPerSearch = parseInt(mixinPerSearch);

  if (isNaN(intMixinPerList) || intMixinPerList < 0 || intMixinPerList > maxPerList) {
    errors = { ...errors, intMixinPerList: `Incorrect value. Min - 0, max - ${maxPerList}` };
  }

  if (isNaN(intMixinPerSearch) || intMixinPerSearch < 0 || intMixinPerSearch > maxPerSearch) {
    errors = { ...errors, intMixinPerList: `Incorrect value. Min - 0, max - ${maxPerSearch}` };
  }

  if (!isEmpty(errors)) {
    return json({ status: "error", errors }, { status: 400 });
  }

  const mixinSettings = await createOrUpdateSettings(
    {
      mixinPerList: intMixinPerList, mixinPerSearch: intMixinPerSearch
    }
  );

  return json({status: "success", message: "Mixin settings updated"});
};
