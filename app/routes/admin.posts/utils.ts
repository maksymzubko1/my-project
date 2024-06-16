import { MenubarItem } from "~/components/Menubar/Menubar";
import { Post } from "~/models/posts.server";

export function generateItems(
  post: Pick<Post, "id" | "status" | "title" | "isDeleted">,
  action: (
    action: "HIDE" | "SHOW" | "DELETE" | "SOFT_DELETE" | "RESTORE",
    id: string,
  ) => void,
) {
  const menuItems: MenubarItem[] = [
    {
      text: post.status === "DRAFTED" ? "Complete creating" : "Edit",
      link: `${post.id}`,
      icon: post.status === "DRAFTED" ? `👌` : `✏`,
    },
  ];

  if (post.status === "HIDDEN") {
    menuItems.push({
      text: "Make visible",
      onClick: () => action("SHOW", post.id),
      icon: `👁`,
    });
  }

  if (post.status === "DEFAULT") {
    menuItems.push({
      text: "Hide",
      onClick: () => action("HIDE", post.id),
      icon: `🙈`,
    });
  }

  if (post.isDeleted) {
    menuItems.push({
      text: "Restore",
      onClick: () => action("RESTORE", post.id),
      icon: `↪️`,
      tooltip: "The post will be restored",
    });
  }

  if (!post.isDeleted && post.status !== "DRAFTED") {
    menuItems.push({
      text: "Archive",
      tooltip:
        "The post will not be available to users, but you can restore it at any time",
      onClick: () => action("SOFT_DELETE", post.id),
      icon: `📦`,
    });
  }

  menuItems.push({
    text: "Delete",
    onClick: () => action("DELETE", post.id),
    icon: "🗑️",
    tooltip: "The post will be deleted permanently",
  });

  return menuItems;
}

export function getIcon(status: Post["status"], isDeleted = false) {
  if (isDeleted) {
    return "📦";
  }

  switch (status) {
    case "DRAFTED":
      return "📝";
    case "HIDDEN":
      return "🙈";
    case "DEFAULT":
      return "📢";
  }
}

export enum Sort {
  ID_ASC = "id_asc",
  ID_DESC = "id_desc",
  DATE_UPDATE_ASC = "dateupdate_asc",
  DATE_UPDATE_DESC = "dateupdate_desc",
  DATE_CREATE_ASC = "datecreate_asc",
  DATE_CREATE_DESC = "datecreate_desc",
  NAME_ASC = "name_asc",
  NAME_DESC = "name_desc",
}

export const sortOptions = [
  {
    id: "0",
    value: "id_asc",
    label: "ID ⬇",
  },
  {
    id: "1",
    value: "id_desc",
    label: "ID ⬆",
  },
  {
    id: "2",
    value: "datecreate_asc",
    label: "Date Created ⬇",
  },
  {
    id: "3",
    value: "datecreate_desc",
    label: "Date Created ⬆",
  },
  {
    id: "2",
    value: "dateupdate_asc",
    label: "Date Updated ⬇",
  },
  {
    id: "3",
    value: "dateupdate_desc",
    label: "Date Updated ⬆",
  },
  {
    id: "4",
    value: "name_asc",
    label: "Title ⬇",
  },
  {
    id: "5",
    value: "name_desc",
    label: "Title ⬆",
  },
];