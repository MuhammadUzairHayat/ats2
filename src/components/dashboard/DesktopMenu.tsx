"use client"
import { NavLinkProps } from "@/types";
import Link from "next/link";
import { memo } from "react";

 export interface NavMenuProps {
  links: NavLinkProps[];
  pathname: string;
}


  const DesktopMenu = memo(({links, pathname}: NavMenuProps ) => (
    <div className="hidden md:ml-8 md:flex md:space-x-1">
      {links.map((link) => {
        const isActive = pathname === link.href;
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`inline-flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
              isActive
                ? "bg-blue-50 text-blue-700"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            }`}
          >
            <link.icon className="w-5 h-5" />
            <span className="ml-2 hidden xl:inline">{link.label}</span>
          </Link>
        );
      })}
    </div>
  ));

  DesktopMenu.displayName = "DesktopMenu"
  export default DesktopMenu