import { ExclamationCircleIcon } from "@heroicons/react/24/outline";
import { useEffect, useRef, useState } from "react";

const FormError = ({ formError }: { formError: string | null }) => {
  const errorRef = useRef<HTMLDivElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [displayError, setDisplayError] = useState<string | null>(null);
  const errorCountRef = useRef(0);

  useEffect(() => {
    if (formError) {
      errorCountRef.current += 1;

      setDisplayError(formError);
      setIsVisible(true);

      // ✅ Delay scroll to ensure DOM is rendered
      const scrollTimer = setTimeout(() => {
        errorRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }, 100);

      // ✅ Auto-dismiss after 5 seconds
      const dismissTimer = setTimeout(() => {
        setIsVisible(false);
      }, 10000);

      // ✅ Cleanup timers on unmount or when formError changes
      return () => {
        clearTimeout(scrollTimer);
        clearTimeout(dismissTimer);
      };
    } else {
      // ✅ Reset when error is cleared
      setIsVisible(false);
      setDisplayError(null);
    }
    // ✅ Add errorCountRef to trigger on same error
  }, [formError]); // removed `errorCountRef.current` from dependencies

  // ✅ Don't render if not visible or no error
  if (!isVisible || !displayError) return null;

  return (
    <div
      ref={errorRef}
      className="flex gap-2 items-center bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl mb-6 animate-fadeIn"
    >
      <ExclamationCircleIcon className="h-8 w-8 text-red-500" />
      {displayError}
    </div>
  );
};

export default FormError;
