import { SkeletonLine, SkeletonBlock, SkeletonCircle, SkeletonTableRow } from "@/components/ui/Skeleton";

export default function CandidatesSkeleton() {
  return (
    <div className="space-y-6">
      {/* Filters Section Skeleton */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div className="flex  justify-between items-center space-x-3 mb-6">
          <span className="flex gap-2"><SkeletonCircle width={40} height={40} className="rounded-lg" /> 
          <SkeletonLine width={192} height={24} />
          </span>
          <SkeletonLine width={170} height={40} />
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {/* Position Filter Skeleton */}
          <div>
            <SkeletonLine width={96} height={16} className="mb-2.5" />
            <SkeletonBlock height={48} className="rounded-xl" />
          </div>

          {/* Status Filter Skeleton */}
          <div>
            <SkeletonLine width={80} height={16} className="mb-2.5" />
            <SkeletonBlock height={48} className="rounded-xl" />
          </div>

          {/* Search Filter Skeleton */}
          <div className="sm:col-span-2">
            <SkeletonLine width={144} height={16} className="mb-2.5" />
            <SkeletonBlock height={48} className="rounded-xl" />
          </div>
        </div>
      </div>

      {/* Table Skeleton */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            {/* Table Header Skeleton */}
            <thead className="bg-gray-50">
              <tr>
                {Array.from({ length: 8 }, (_, index) => (
                  <th key={index} className="px-6 py-4">
                    <SkeletonLine
                      width={
                        index === 0 ? 80 :
                        index === 1 ? 64 :
                        index === 2 ? 72 :
                        index === 3 ? 56 :
                        index === 4 ? 48 :
                        index === 5 ? 80 :
                        index === 6 ? 48 : 64
                      }
                      height={14}
                    />
                  </th>
                ))}
              </tr>
            </thead>

            {/* Table Body Skeleton */}
            <tbody className="bg-white divide-y divide-gray-100">
              {Array.from({ length: 7}, (_, index) => (
                <SkeletonTableRow key={index} columns={8} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}