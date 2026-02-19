import { Position, Status } from "@/types";
import React, { ChangeEvent } from "react";

interface FilterDropdownListProps {
  fieldName: string;
  defaultOption: string;
  filtered: Position[] | Status[];
  setInputValue: (value: string) => void;
  setFilterQuery: (value: string) => void;
  handleFilterChange: (e: ChangeEvent<HTMLInputElement>) => void;
  setOpen: (value: boolean) => void;
}

const FilterDropdownList = ({
  fieldName,
  defaultOption,
  filtered,
  setInputValue,
  setFilterQuery,
  handleFilterChange,
  setOpen,
}: FilterDropdownListProps) => {
  return (
    <ul className="absolute z-[100] max-h-60 w-full overflow-auto rounded-b-xl border bg-white  border-gray-200">
      <li
        onMouseDown={(e) => {
          e.preventDefault();
          setInputValue("");
          setFilterQuery("");
          handleFilterChange({
            target: {
              name: fieldName,
              value: "",
              nodeName: "INPUT",
              nodeType: 1,
            },
          } as ChangeEvent<HTMLInputElement>);
          setOpen(false);
        }}
        className="px-4 py-2 hover:bg-blue-50 cursor-pointer"
      >
        {defaultOption}
      </li>
      {filtered.map((pos: Position | Status) => {
        if(pos.isDeleted) return
        return (
          <li
            key={pos.id}
            onMouseDown={(e) => {
              e.preventDefault();
              setInputValue(pos.name);
              setFilterQuery("");
              handleFilterChange({
                target: {
                  name: fieldName,
                  value: pos.name,
                  // Add required properties to match ChangeEvent
                  nodeName: "INPUT",
                  nodeType: 1,
                },
              } as ChangeEvent<HTMLInputElement>);
              setOpen(false);
            }}
            className={`px-4 py-2 hover:bg-blue-50 cursor-pointer ${
              pos.isDeleted === 1 ? "opacity-60 bg-red-50" : ""
            }`}
          >
            <div className="flex items-center justify-between">
              <span>{pos.name}</span>
              {pos.isDeleted === 1 && (
                <span className="text-xs bg-red-100 text-red-700 px-1.5 py-0.5 rounded">
                  in Trash
                </span>
              )}
            </div>
          </li>
        );
      })}
    </ul>
  );
};

export default FilterDropdownList;
