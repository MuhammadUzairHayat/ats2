"use client";
import Link from "next/link";

const NavLogoDev = () => {
  return (
    <div className="flex-shrink-0 flex items-center">
      <Link
        href="/dashboard"
        className="flex items-center space-x-2 text-xl font-semibold"
      >
        <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-sm">TA</span>
        </div>
        <span className="hidden md:block sm:block bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
          Techwards ATS
        </span>
      </Link>
    </div>
  );
};

export default NavLogoDev;
