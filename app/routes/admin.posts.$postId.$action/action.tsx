import type { ActionFunctionArgs } from "@remix-run/node";
import { requireUserId } from "~/session.server";
import invariant from "tiny-invariant";
import { changePostStatus, deletePost, getPost } from "~/models/posts.server";
import { json } from "@remix-run/node";

export const action = async ({ params, request }: ActionFunctionArgs) => {
  await requireUserId(request);
  invariant(params.postId, "postId not found");

  const post = await getPost({ id: params.postId });

  if (!post) {
    return json({ status: "error", message: "Not found post" }, { status: 404 });
  }

  const action = params.action;

  if(!action || !['soft_delete', 'hide', 'show', 'permanent_delete', 'restore'].includes(action)){
    return json({ status: "error", message: "Incorrect params" }, { status: 400 });
  }

  try{
    switch (action) {
      case "soft_delete":
        await changePostStatus({id: params.postId, status: "DELETED"});
        return json({ status: "success", message: "Post has been soft deleted" }, { status: 200 });
      case "delete":
        await deletePost({id: params.postId});
        return json({ status: "success", message: "Post has been deleted" }, { status: 200 });
      case "hide":
        await changePostStatus({id: params.postId, status: "HIDDEN"});
        return json({ status: "success", message: "Post display has been disabled" }, { status: 200 });
      case "show":
        await changePostStatus({id: params.postId, status: "DEFAULT"});
        return json({ status: "success", message: "Post display has been enabled" }, { status: 200 });
      case "restore":
        await changePostStatus({id: params.postId, status: "DEFAULT"});
        return json({ status: "success", message: "Post has been restored" }, { status: 200 });
    }
  } catch (e){
    return json({ status: "error", message: e.message || "Unexpected error" }, { status: 500 });
  }
};