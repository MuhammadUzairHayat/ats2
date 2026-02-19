import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import React, { memo } from "react";

interface MobileMenuToggleProps {
  isMobileMenuOpen: boolean;
  onclick: () => void;
}
const MobileMenuToggle = memo(({
  isMobileMenuOpen,
  onclick,
}: MobileMenuToggleProps) => {
  return (
    <div className="md:hidden">
      <button
        onClick={onclick}
        className="inline-flex cursor-pointer items-center justify-center p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
      >
        {isMobileMenuOpen ? (
          <XMarkIcon className="block h-6 w-6" />
        ) : (
          <Bars3Icon className="block h-6 w-6" />
        )}
      </button>
    </div>
  );
});

MobileMenuToggle.displayName = "MobileMenuToggle"
export default MobileMenuToggle;
