"use client";

import { memo } from "react";
import { NavMenuProps } from "./DesktopMenu";
import Link from "next/link";


interface MobileMenuProps extends NavMenuProps {
  isMobileMenuOpen: boolean;
  onClick: () => void;
}

const MobileMenu = memo(({ links, pathname, isMobileMenuOpen, onClick}: MobileMenuProps) => (
  <div
    className={`md:hidden transition-all duration-300 ease-in-out ${
      isMobileMenuOpen ? "block" : "hidden"
    }`}
  >
    <div className="grid z-[1000] grid-cols-1 gap-2 bg-white rounded-lg p-2 shadow-lg mb-3">
      {links.map((link) => {
        const isActive = pathname === link.href;
        return (
          <Link
            key={link.href}
            href={link.href}
            onClick={onClick}
            className={`flex items-center px-4 py-3 rounded-md text-sm font-medium transition-colors duration-200 ${
              isActive
                ? "bg-blue-50 text-blue-700"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            }`}
          >
            <link.icon className="w-5 h-5 mr-3" />
            {link.label}
          </Link>
        );
      })}
    </div>
  </div>
));

MobileMenu.displayName = "MobileMenu";
export default MobileMenu;
