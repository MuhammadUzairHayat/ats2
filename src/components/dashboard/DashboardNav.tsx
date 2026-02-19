"use client";

import { usePathname } from "next/navigation";
import { useState, useRef, useEffect, useCallback } from "react";
import { SessionProps } from "@/types";
import {
  HomeIcon,
  UserGroupIcon,
  BriefcaseIcon,
  ClipboardDocumentListIcon,
} from "@heroicons/react/24/outline";
import DesktopMenu from "./DesktopMenu";
import MobileMenu from "./MobileMenu";
import UserAvatarDropdown from "./UserAvatarDropdown";
import NavLogoDev from "./NavLogoDev";
import MobileMenuToggle from "./MobileMenuToggle";
import { NextSessionProvider } from "@/contexts/session-provider";

const links = [
  { href: "/dashboard", label: "Dashboard", icon: HomeIcon },
  {
    href: "/candidates",
    label: "Candidates",
    icon: UserGroupIcon,
  },
  { href: "/positions", label: "Positions", icon: BriefcaseIcon },
  {
    href: "/statuses",
    label: "Statuses",
    icon: ClipboardDocumentListIcon,
  },
];

export default function DashboardNav({ user }: SessionProps) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const mobileMenuHandle = useCallback(() => {
    setIsMobileMenuOpen((prev) => !prev);
  }, []);

  const userAvatarHandler = useCallback(() => {
    setIsUserDropdownOpen((prev) => !prev);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsUserDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <NextSessionProvider>
      <nav className="z-50 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              {/* Logo and Navigation */}
              <NavLogoDev />
              {/* DesktopMenu */}
              <DesktopMenu links={links} pathname={pathname} />
            </div>

            <div className="flex items-center space-x-4">
              {/* User Avatar Dropdown */}
              <div className="block">
                <UserAvatarDropdown
                  user={user}
                  isUserDropdownOpen={isUserDropdownOpen}
                  dropdownRef={dropdownRef}
                  onclick={userAvatarHandler}
                />
              </div>

              {/* Mobile Menu Toggle */}
              <MobileMenuToggle
                isMobileMenuOpen={isMobileMenuOpen}
                onclick={mobileMenuHandle}
              />
            </div>
          </div>

          <MobileMenu
            links={links}
            pathname={pathname}
            isMobileMenuOpen={isMobileMenuOpen}
            onClick={mobileMenuHandle}
          />
        </div>

        {/* Overlay for desktop dropdown */}
        {isUserDropdownOpen && (
          <div
            className="fixed inset-0 z-40 md:block hidden"
            onClick={() => setIsUserDropdownOpen(false)}
          />
        )}
      </nav>
    </NextSessionProvider>
  );
}
