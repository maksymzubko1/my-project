import { MenubarItem } from "~/components/Menubar/Menubar";
import { RSSSettings } from "~/models/rss.server";

export function generateItems(
  rss: Pick<RSSSettings, "id" | "name" | "isPaused">,
  action: (action: "DELETE" | "PAUSE" | "RESUME", id: string) => void,
) {
  const menuItems: MenubarItem[] = [
    {
      text: "Edit",
      link: `${rss.id}`,
      icon: `✏`,
    },
  ];

  if (rss.isPaused) {
    menuItems.push({
      text: "Resume",
      onClick: () => action("RESUME", rss.id),
      icon: `▶️`,
      tooltip: "Rss will be resumed",
    });
  } else {
    menuItems.push({
      text: "Pause",
      onClick: () => action("PAUSE", rss.id),
      icon: `⏸️`,
      tooltip: "Rss will be stopped, you can resume at any time",
    });
  }

  menuItems.push({
    text: "Delete",
    onClick: () => action("DELETE", rss.id),
    icon: "🗑️",
    tooltip: "The rss will be deleted permanently",
  });

  return menuItems;
}

export function getIcon(isPaused: RSSSettings["isPaused"]) {
  if (isPaused) {
    return "⏸️";
  } else {
    return "🚀";
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
    label: "Name ⬇",
  },
  {
    id: "5",
    value: "name_desc",
    label: "Name ⬆",
  },
];
