import { SkeletonLine, SkeletonBlock, SkeletonTableRow, SkeletonText } from "@/components/ui/Skeleton";

export default function PositionsSkeleton() {
  return (
    <div className="space-y-8">
      {/* Page Header Skeleton */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-3">
            <SkeletonBlock width={8} height={32} className="rounded-full" />
            <SkeletonLine width={224} height={36} />
          </div>
          <SkeletonText lines={2} lastLineWidth="90%" />
        </div>

        {/* Action Button Skeleton */}
        <div className="flex-shrink-0">
          <SkeletonBlock width={160} height={48} className="rounded-xl" />
        </div>
      </div>

      {/* Positions Table Skeleton */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            {/* Table Header Skeleton */}
            <thead className="bg-gradient-to-r from-gray-50 to-blue-50">
              <tr>
                <th className="px-6 py-4 w-1/5">
                  <SkeletonLine width={120} height={14} />
                </th>
                <th className="px-6 py-4 w-1/6">
                  <SkeletonLine width={88} height={14} />
                </th>
                <th className="px-6 py-4 w-1/6">
                  <SkeletonLine width={64} height={14} />
                </th>
                <th className="px-6 py-4 w-1/4">
                  <SkeletonLine width={96} height={14} />
                </th>
                <th className="px-6 py-4 w-1/6">
                  <SkeletonLine width={64} height={14} />
                </th>
              </tr>
            </thead>

            {/* Table Body Skeleton */}
            <tbody className="bg-white divide-y divide-gray-100">
              {Array.from({ length: 7 }, (_, index) => (
                <SkeletonTableRow key={index} columns={5} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
