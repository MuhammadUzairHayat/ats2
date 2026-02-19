import Image from "next/image";
import SignOutButton from "../auth/SignoutButton";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { RefObject } from "react";

interface UserDropdownProps {
  user?: {
    name?: string | null,
    email?: string | null,
    image?: string | null,
    expires?: string | null,
  }
  isUserDropdownOpen: boolean,
  dropdownRef: RefObject<HTMLDivElement | null>,
  onclick: () => void
}

  const UserAvatarDropdown = ({user, isUserDropdownOpen,  dropdownRef, onclick}: UserDropdownProps) => (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={onclick}
        className="flex items-center space-x-2 bg-gray-50 cursor-pointer rounded-full pl-1 pr-3 py-1 hover:bg-gray-100 transition-colors duration-200"
      >
        {user?.image ? (
          <Image
            src={user.image}
            alt={user.name || "User"}
            width={32}
            height={32}
            className="rounded-full"
          />
        ) : (
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-medium">
              {user?.name?.charAt(0).toUpperCase() || "U"}
            </span>
          </div>
        )}
        <span className="text-sm font-medium text-gray-700 hidden sm:block">
          {user?.name}
        </span>
        <ChevronDownIcon className="w-4 h-4 text-gray-400" />
      </button>

      {isUserDropdownOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
          <div className="px-4 py-3 border-b border-gray-100">
            <div className="flex items-center space-x-3">
              {user?.image ? (
                <Image
                  src={user.image}
                  alt={user.name || "User"}
                  width={40}
                  height={40}
                  className="rounded-full"
                />
              ) : (
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-medium">
                    {user?.name?.charAt(0).toUpperCase() || "U"}
                  </span>
                </div>
              )}
              <div>
                <p className="text-sm font-semibold text-gray-900">{user?.name}</p>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-100 px-2 py-2">
            <SignOutButton
              className="w-full cursor-pointer flex items-center justify-center px-3 py-2 text-sm text-red-600 bg-red-50 hover:bg-red-100 rounded-md transition-colors duration-200"
            />
          </div>
        </div>
      )}
    </div>
  );

  export default UserAvatarDropdown