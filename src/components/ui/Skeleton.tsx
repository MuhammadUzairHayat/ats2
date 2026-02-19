import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
interface SkeletonProps {
  className?: string;
  variant?: "default" | "rounded" | "circular";
  width?: string | number;
  height?: string | number;
}


export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
/**
 * Base skeleton component with smooth animation
 * Provides consistent loading states across the application
 */
export function Skeleton({
  className,
  variant = "default",
  width,
  height,
  ...props
}: SkeletonProps & React.HTMLAttributes<HTMLDivElement>) {
  const baseClasses = "animate-pulse bg-gray-200";

  const variantClasses = {
    default: "",
    rounded: "rounded-lg",
    circular: "rounded-full",
  };

  const style: React.CSSProperties = {};
  if (width) style.width = typeof width === "number" ? `${width}px` : width;
  if (height) style.height = typeof height === "number" ? `${height}px` : height;

  return (
    <div
      className={cn(baseClasses, variantClasses[variant], className)}
      style={style}
      {...props}
    />
  );
}

/**
 * Skeleton line component for text placeholders
 */
export function SkeletonLine({
  className,
  width = "100%",
  height = 16,
  ...props
}: Omit<SkeletonProps, "variant"> & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <Skeleton
      variant="rounded"
      width={width}
      height={height}
      className={className}
      {...props}
    />
  );
}

/**
 * Skeleton block component for card or container placeholders
 */
export function SkeletonBlock({
  className,
  width = "100%",
  height = 40,
  ...props
}: Omit<SkeletonProps, "variant"> & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <Skeleton
      variant="rounded"
      width={width}
      height={height}
      className={className}
      {...props}
    />
  );
}

/**
 * Skeleton circle component for avatar or icon placeholders
 */
export function SkeletonCircle({
  className,
  width = 40,
  height = 40,
  ...props
}: Omit<SkeletonProps, "variant"> & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <Skeleton
      variant="circular"
      width={width}
      height={height}
      className={className}
      {...props}
    />
  );
}

/**
 * Skeleton text component for multi-line text placeholders
 */
export function SkeletonText({
  lines = 3,
  className,
  lineHeight = 16,
  lastLineWidth = "60%",
  ...props
}: {
  lines?: number;
  lineHeight?: number;
  lastLineWidth?: string;
} & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("space-y-2", className)} {...props}>
      {Array.from({ length: lines }, (_, index) => (
        <SkeletonLine
          key={index}
          height={lineHeight}
          width={index === lines - 1 ? lastLineWidth : "100%"}
        />
      ))}
    </div>
  );
}

/**
 * Skeleton card component for dashboard cards or similar layouts
 */
export function SkeletonCard({
}: {
  showAvatar?: boolean;
  showProgress?: boolean;
} & React.HTMLAttributes<HTMLDivElement>) {
  return (
<div
  
      className="flex flex-col justify-between rounded-2xl border border-gray-100 bg-white p-6 hover:shadow-sm transition-all duration-300 animate-pulse"
    >
      {/* Top Section */}
      <div className="flex flex-1 items-start justify-between">
        <div className="flex items-center">
          {/* Icon Skeleton */}
          <div className="h-12 w-12 rounded-xl bg-gray-200"></div>
          <div className="ml-4 space-y-2">
            {/* Status Title */}
            <div className="h-4 w-24 rounded bg-gray-200"></div>
            {/* Count */}
            <div className="h-6 w-12 rounded bg-gray-300"></div>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="mt-4">
        <div className="flex justify-between items-end py-3">
          {/* Breakdown badges skeleton */}
          <div className="flex gap-2">
            <div className="h-5 w-14 rounded-md bg-gray-200"></div>
            <div className="h-5 w-14 rounded-md bg-gray-200"></div>
            <div className="h-5 w-14 rounded-md bg-gray-200"></div>
          </div>
          {/* Percentage */}
          <div className="h-4 w-10 rounded bg-gray-200"></div>
        </div>

        {/* Progress Bar */}
        <div className="w-full rounded-full h-2 bg-gray-200">
          <div className="h-2 rounded-full bg-gray-300 w-1/2"></div>
        </div>
      </div>
    </div>
  );
}

/**
 * Skeleton table row component for data table loading states
 */
export function SkeletonTableRow({
  columns = 6,
  className,
  ...props
}: {
  columns?: number;
} & React.HTMLAttributes<HTMLTableRowElement>) {
  return (
    <tr className={cn("animate-pulse", className)} {...props}>
      {Array.from({ length: columns }, (_, index) => (
        <td key={index} className="px-6 py-4">
          {index === 0 ? (
            <div className="flex items-center">
              <SkeletonCircle width={40} height={40} />
              <div className="ml-4 space-y-2">
                <SkeletonLine width={128} height={16} />
                <SkeletonLine width={80} height={12} />
              </div>
            </div>
          ) : index === columns - 1 ? (
            <div className="flex items-center justify-center space-x-2">
              <SkeletonBlock width={32} height={32} className="rounded-lg" />
              <SkeletonBlock width={32} height={32} className="rounded-lg" />
            </div>
          ) : (
            <SkeletonLine
              width={index === 1 ? 96 : index === 2 ? 64 : 80}
              height={16}
            />
          )}
        </td>
      ))}
    </tr>
  );
}