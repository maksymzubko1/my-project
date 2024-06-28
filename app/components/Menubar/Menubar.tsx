import { Link } from "@remix-run/react";
import React from "react";

import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
} from "~/components/shadcn/ui/menubar";
import Tooltip from "~/components/Tooltip/Tooltip";

interface MenubarProps {
  children: React.ReactNode;
  items: MenubarItem[];
  id: string;
}

export interface MenubarItem {
  text: string;
  isSeparator?: boolean;
  icon?: string | React.ReactElement | React.ExoticComponent;
  link?: string;
  tooltip?: string;
  onClick?: () => void;
}

const MenubarComponent = ({ children, items, id }: MenubarProps) => {
  return (
    <Menubar id={id}>
      <MenubarMenu>
        <MenubarTrigger className="cursor-pointer">{children}</MenubarTrigger>
        <MenubarContent>
          {items.map((item, index) =>
            item.isSeparator ? (
              <MenubarSeparator key={index} />
            ) : (
              <MenubarItem
                key={index}
                className="cursor-pointer"
                onClick={item?.onClick}
              >
                <Tooltip
                  disabled={!item.tooltip?.length}
                  tooltip={item.tooltip}
                >
                  {item.link ? (
                    <Link
                      to={item.link}
                      className="flex items-center gap-2 w-full"
                    >
                      {typeof item.icon === "string" ? item.icon : <item.icon />} {item.text}
                    </Link>
                  ) : (
                    <span className="flex items-center gap-2">
                      {typeof item.icon === "string" ? item.icon : <item.icon />} {item.text}
                    </span>
                  )}
                </Tooltip>
              </MenubarItem>
            ),
          )}
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  );
};

export default MenubarComponent;
