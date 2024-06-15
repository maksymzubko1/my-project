import React from "react";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu, MenubarSeparator,
  MenubarTrigger
} from "~/components/shadcn/ui/menubar";
import { Link } from "@remix-run/react";
import Tooltip from "~/components/Tooltip/Tooltip";

interface MenubarProps {
  children: React.ReactNode;
  items: MenubarItem[];
  id: string;
}

export interface MenubarItem {
  text: string;
  isSeparator?: boolean;
  icon?: string | React.ReactNode;
  link?: string;
  tooltip?: string;
  onClick?: () => void;
}

const MenubarComponent = ({ children, items, id }: MenubarProps) => {
  return (
    <Menubar>
      <MenubarMenu>
        <MenubarTrigger className="cursor-pointer">{children}</MenubarTrigger>
        <MenubarContent>
          {items.map(item =>
            item.isSeparator ?
              <MenubarSeparator />
              : <MenubarItem className="cursor-pointer" onClick={item?.onClick}>
                <Tooltip disabled={!item.tooltip?.length} tooltip={item.tooltip}>
                  {item.link ?
                    <Link to={item.link} className="flex items-center gap-2">
                      {item.icon} {item.text}
                    </Link>
                    : <span className="flex items-center gap-2">{item.icon} {item.text}</span>
                  }
                </Tooltip>
              </MenubarItem>
          )}
        </MenubarContent>
      </MenubarMenu>
    </Menubar>

  );
};

export default MenubarComponent;