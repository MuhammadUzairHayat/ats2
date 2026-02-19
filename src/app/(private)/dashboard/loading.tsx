import { SkeletonCard, SkeletonLine, SkeletonBlock, SkeletonText } from "@/components/ui/Skeleton";

export default function DashboardLoading() {
  return (
    <div className="space-y-8">
      {/* Page Header Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-1">
        <div>
          <SkeletonLine width={280} height={36} className="mb-2" />
          <SkeletonText lines={2} lastLineWidth="85%" />
        </div>
        <SkeletonBlock width={340} height={48} className="rounded-xl" />
      </div>

      {/* Filter/Action Bar Skeleton */}
      <SkeletonBlock width={144} height={48} className="rounded-full" />

      {/* Stats Grid Skeleton */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Candidates Card */}
        <SkeletonCard showAvatar={true} />

        {/* Status Cards */}
        {Array.from({ length: 15 }, (_, index) => (
          <SkeletonCard key={index} showAvatar={true} showProgress={true} />
        ))}
      </div>
    </div>
  );
}

