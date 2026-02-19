import { FORM_STYLES } from "@/lib/constants/form-styles";
import { FormField } from "../form";

interface StatusFlagSelectProps {
  value: string;
  onChangeHandler: (value: string) => void;
  disabled?: boolean;
  helperText?: string;
}

const StatusFlagSelect = ({
  value,
  onChangeHandler,
  disabled = false,
  helperText,
}: StatusFlagSelectProps) => {
  return (
    <FormField label="Status Flag" htmlFor="statusFlag">
      <select
        title="status flag"
        name="statusFlag"
        id="statusFlag"
        value={value}
        onChange={(e) => onChangeHandler(e.target.value)}
        disabled={disabled}
        className={`${FORM_STYLES.input} ${
          disabled
            ? "bg-gray-100 cursor-not-allowed opacity-60"
            : value === "active"
            ? "text-green-600"
            : value === "onHold"
            ? "text-amber-600"
            : value === "rejected"
            ? "text-red-600"
            : ""
        }`}
      >
        <option value="active">Active</option>
        <option value="onHold">On Hold</option>
        <option value="rejected">Rejected</option>
      </select>
      {helperText && (
        <p className="mt-1 text-sm text-gray-600 italic">{helperText}</p>
      )}
    </FormField>
  );
};

export default StatusFlagSelect;