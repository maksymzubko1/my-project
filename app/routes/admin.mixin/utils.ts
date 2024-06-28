import { MenubarItem } from "~/components/Menubar/Menubar";
import { Mixin } from "~/models/mixin.server";
import { MixIcon, Pencil1Icon, Pencil2Icon, RocketIcon, TrashIcon } from "@radix-ui/react-icons";

export function generateItems(
  mixin: Pick<Mixin, "id" | "name" | "draft">,
  action: (action: "DELETE", id: string) => void,
) {
  const menuItems: MenubarItem[] = [
    {
      text: mixin.draft ? "Complete creating" : "Edit",
      link: `${mixin.id}`,
      icon: mixin.draft ? RocketIcon : Pencil2Icon,
    },
  ];

  menuItems.push({
    text: "Delete",
    onClick: () => action("DELETE", mixin.id),
    icon: TrashIcon,
    tooltip: "The mixin will be deleted permanently",
  });

  return menuItems;
}

export function getIcon(isDrafted: boolean) {
  if (isDrafted) {
    return Pencil1Icon;
  }

  return MixIcon;
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
