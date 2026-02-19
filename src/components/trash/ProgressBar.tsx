import { ProgressState } from "./types";

interface ProgressBarProps {
  progress: ProgressState;
}

export default function ProgressBar({ progress }: ProgressBarProps) {
  if (progress.total === 0) return null;

  const percentage = Math.round((progress.current / progress.total) * 100);

  return (
    <div className="mt-2 animate-in fade-in duration-200">
      <div className="flex items-center gap-2">
        <div
          title="progress bar"
          className="flex-1 bg-blue-200 rounded-full h-2 overflow-hidden"
          role="progressbar"

        >
          <div
            className="bg-blue-600 h-full transition-all duration-300 ease-out"
            style={{ width: `${percentage}%` }}
            aria-hidden="true"
          />
        </div>
        <span className="text-xs text-blue-700 font-medium min-w-[60px]" aria-live="polite">
          {progress.current}/{progress.total}
        </span>
      </div>
    </div>
  );
}