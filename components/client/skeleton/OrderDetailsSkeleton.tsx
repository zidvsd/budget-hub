import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";

export function OrderDetailsSkeleton() {
  return (
    <div className="mx-auto max-w-5xl mt-8 pb-20 px-4 space-y-8 animate-pulse">
      {/* Breadcrumb Skeleton */}
      <Skeleton className="h-4 w-32" />

      {/* Header Skeleton */}
      <div className="flex items-start gap-4 mt-6">
        <Skeleton className="h-10 w-10 rounded-full shrink-0" />{" "}
        {/* Back Button */}
        <div className="flex flex-col md:flex-row md:items-center justify-between w-full gap-4">
          <div className="space-y-2">
            <Skeleton className="h-8 w-64" /> {/* Title */}
            <Skeleton className="h-4 w-48" /> {/* Timestamp */}
          </div>
          <Skeleton className="h-9 w-28 rounded-full" /> {/* Status Badge */}
        </div>
      </div>

      {/* Track Status Skeleton */}
      <Skeleton className="h-28 w-full rounded-xl" />

      {/* Main Content Grid Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
        {/* Left Column: Items */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-card rounded-xl border p-6 space-y-6 shadow-sm">
            <Skeleton className="h-6 w-32" /> {/* Section Title */}
            <div className="space-y-4">
              <Skeleton className="h-24 w-full rounded-lg" />{" "}
              {/* Order Item Card */}
              <Skeleton className="h-24 w-full rounded-lg" />
            </div>
            <Separator className="my-4" />
            <div className="space-y-3 pt-2">
              <div className="flex justify-between">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-16" />
              </div>
              <div className="flex justify-between">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-16" />
              </div>
              <Separator />
              <div className="flex justify-between pt-2">
                <Skeleton className="h-7 w-32" />
                <Skeleton className="h-7 w-24" />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Details & Status Card */}
        <div className="flex flex-col md:flex-row lg:flex-col gap-6 lg:col-span-1">
          {/* Delivery Details Card */}
          <div className="bg-card rounded-xl border p-6 space-y-6 flex-1 shadow-sm">
            <Skeleton className="h-6 w-40" /> {/* Section Title */}
            <Separator />
            <div className="space-y-5">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex gap-3">
                  <Skeleton className="h-5 w-5 rounded-full" /> {/* Icon */}
                  <div className="space-y-2">
                    <Skeleton className="h-3 w-20" /> {/* Label */}
                    <Skeleton className="h-4 w-40" /> {/* Value */}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Status Message Card Placeholder */}
          <Skeleton className="h-36 w-full rounded-xl flex-1 lg:flex-none shadow-sm" />
        </div>
      </div>
    </div>
  );
}
