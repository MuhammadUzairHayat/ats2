import { Switch } from "@headlessui/react";
import { CheckIcon, XMarkIcon } from "@heroicons/react/24/outline";

interface ValidationCheckboxProps {
  checked: boolean;
  onChange: () => void;
  label: string;
}

const ValidationCheckbox = ({
  checked,
  onChange,
  label,
}: ValidationCheckboxProps) => {
  return (
    <Switch.Group>
      <div className="flex items-center space-x-2">
        <Switch
          checked={checked}
          onChange={onChange}
          className={`${
            checked ? "bg-blue-600" : "bg-gray-200"
          } relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none`}
        >
          <span
            className={`${
              checked ? "translate-x-5" : "translate-x-1"
            } inline-block h-3 w-3 transform rounded-full bg-white transition-transform`}
          />
        </Switch>

        {/* 👇 Label hidden on small screens */}
        <Switch.Label className="hidden sm:block text-sm text-gray-600">
          {label}
        </Switch.Label>

        {checked ? (
          <CheckIcon className="w-4 h-4 text-green-500" />
        ) : (
          <XMarkIcon className="w-4 h-4 text-red-500" />
        )}
      </div>
    </Switch.Group>
  );
};

export default ValidationCheckbox;
