import { useEffect, useState, type ChangeEvent } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { Filters } from "@/types";

export default function SearchFilter({
  className,
  filters,
  handleFilterChange,
}: {
  className?: string;
  filters: Filters;
  handleFilterChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
}) {
  const [query, setQuery] = useState<string>(filters.search ?? "");

  useEffect(() => {
    // Sync local query only when the incoming filter prop changes.
    setQuery(filters.search ?? "");
  }, [filters.search]);

  useEffect(() => {
    const id = window.setTimeout(() => {
      const syntheticEvent = {
        target: { name: "search", value: query },
      } as unknown as ChangeEvent<HTMLInputElement>;
      handleFilterChange(syntheticEvent);
    }, 300);
    return () => window.clearTimeout(id);
  }, [query, handleFilterChange]);

  return (
    // parent should pass sizing via className (wrapper in CandidatesFilters)
    <div className={`${className ?? ""}`}>
      <label
        htmlFor="search"
        className="block text-sm font-medium text-gray-700 mb-2.5"
      >
        Search Candidates
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          name="search"
          id="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl  focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-all duration-200 text-gray-900 placeholder-gray-400"
          placeholder="name, email, skills..."
        />
      </div>
    </div>
  );
}
