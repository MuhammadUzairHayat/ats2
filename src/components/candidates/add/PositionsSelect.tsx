"use client"
import { Position } from "@/types";
import React from "react";

interface PositionsSelectProps {
  positions: Position[];
  value: string | undefined;
  onChangeHandler: (value: string) => void;
  defaultValue?: string;
}

const PositionsSelect = ({ value, positions, onChangeHandler }: PositionsSelectProps) => {
  
  return (
    <div className="sm:col-span-3">
      <label
        htmlFor="position"
        className="block text-sm font-medium text-gray-700 mb-2.5"
        >
        Position *
      </label>
      <select
        id="position"
        name="position"
        required
        key={value} 
        defaultValue={value}
        onChange={(e)=> onChangeHandler(e.target.value)}
        className="w-full px-4 py-[14px] border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 bg-white"
      >
        <option value="">Select Position</option>
        {positions
          .filter((position) => position.isDeleted !== 1)
          .map((position) => (
            <option key={position.id} value={position.name as string}>
              {position.name}
            </option>
          ))}
      </select>
    </div>
  );
};

export default PositionsSelect;
