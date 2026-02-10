import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";

export function CheckoutSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[6fr_4fr] gap-8 w-full animate-pulse">
      {/* Left Side Skeleton */}
      <div className="space-y-6">
        {/* Shipping Info Card */}
        <div className="bg-card rounded-lg border p-6 space-y-6">
          <div className="flex justify-between items-center">
            <Skeleton className="h-7 w-48" />
            <Skeleton className="h-9 w-24 rounded-md" />
          </div>
          <Separator />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-5 w-full" />
              </div>
            ))}
          </div>
        </div>

        {/* Payment Card Skeleton */}
        <div className="bg-card rounded-lg border p-6 space-y-4">
          <Skeleton className="h-7 w-40" />
          <Separator />
          <Skeleton className="h-16 w-full rounded-md" />
        </div>
      </div>

      {/* Right Side Skeleton (Summary) */}
      <div className="space-y-6">
        <div className="bg-card rounded-lg border p-6 space-y-6">
          <Skeleton className="h-7 w-32" />
          <Separator />
          <div className="space-y-4">
            <Skeleton className="h-24 w-full rounded-md" />
            <Separator />
            <div className="space-y-3">
              <div className="flex justify-between">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-20" />
              </div>
              <div className="flex justify-between">
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-6 w-28" />
              </div>
            </div>
            <Skeleton className="h-11 w-full rounded-md" /> {/* Button */}
            <Skeleton className="h-11 w-full rounded-md" /> {/* Button */}
          </div>
        </div>
      </div>
    </div>
  );
}
