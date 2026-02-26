import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function AnalyticsSkeleton() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="space-y-4">
        <Skeleton className="h-8 w-1/3" />
        <Skeleton className="h-5 w-2/3" />

        {/* Skeleton for the Filter/Status Card */}
        <Skeleton className="h-24 w-full mt-2" />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-8">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="p-6 h-[350px] flex flex-col gap-4">
              <Skeleton className="h-6 w-1/2" />
              <Skeleton className="h-4 w-3/4" />
              <div className="flex-1 flex items-center justify-center">
                <Skeleton className="h-40 w-40 rounded-full" />
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
