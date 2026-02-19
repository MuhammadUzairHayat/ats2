import { PlusIcon } from "@heroicons/react/24/outline";
import Link from "next/link";


export const AddPositionButton = () => {
  return (
    <Link
      href="/dashboard/positions/new"
      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-150"
    >
      <PlusIcon className="h-5 w-5" />
      <span>Add Position</span>
    </Link>
  );
};