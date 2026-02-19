import { Status } from "@/types";
import React from "react";
interface StatusesSelectProps {
  statuses: Status[];
  value: string | undefined;
  onChangeHandler: (field: string) => void;
  defaultValue?: string;
}
const StatusesSelect = ({
  statuses,
  value,
  onChangeHandler,
}: StatusesSelectProps) => {
  return (
    <div className="sm:col-span-3">
      <label
        htmlFor="status"
        className="block text-sm font-medium text-gray-700 mb-2.5"
      >
        Status *
      </label>
      <select
        key={value}
        id="status"
        name="status"
        defaultValue={value}
        onChange={(e) => onChangeHandler(e.target.value)}
        required
        className="w-full px-4 py-[14px] border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 bg-white"
      >
        <option value="">Select Status</option>
        {statuses
          .filter((status) => status.isDeleted !== 1)
          .map((status: Status) => (
            <option key={status.id} value={status.name}>
              {status.name}
            </option>
          ))}
      </select>
    </div>
  );
};

export default StatusesSelect;
