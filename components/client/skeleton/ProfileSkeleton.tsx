"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function ProfileSkeleton() {
  return (
    <div className="flex flex-col gap-6 w-full animate-in fade-in duration-500">
      {/* Profile Header Skeleton */}
      <Card className="overflow-hidden border-none shadow-sm bg-card/50">
        <CardContent className="flex flex-col md:flex-row items-start gap-6 p-6">
          {/* Avatar Skeleton */}
          <Skeleton className="w-28 h-28 rounded-full shrink-0 mx-auto md:mx-0" />

          {/* User Info Skeleton */}
          <div className="flex flex-col justify-between flex-1 space-y-4 w-full">
            <div className="space-y-3">
              <Skeleton className="h-8 w-1/3 mx-auto md:mx-0" /> {/* Name */}
              <div className="flex flex-wrap justify-center md:justify-start gap-4">
                <Skeleton className="h-4 w-24" /> {/* Email */}
                <Skeleton className="h-4 w-20" /> {/* Phone */}
                <Skeleton className="h-4 w-32" /> {/* Date */}
              </div>
            </div>
            <Skeleton className="h-10 w-32 rounded-md mx-auto md:mx-0" />{" "}
            {/* Edit Button */}
          </div>
        </CardContent>
      </Card>

      {/* Stat Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="p-6 space-y-3 border-none shadow-sm">
            <div className="flex justify-between items-center">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-8 w-8 rounded-full" />
            </div>
            <Skeleton className="h-8 w-16" />
            <Skeleton className="h-3 w-32" />
          </Card>
        ))}
      </div>

      {/* Account Details Skeleton */}
      <Card className="border-none shadow-sm">
        <CardContent className="p-6 space-y-8">
          <div className="space-y-2">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-4 w-60" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-8">
              {[1, 2].map((i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-6 w-1/2" />
                </div>
              ))}
            </div>
            <div className="space-y-8">
              {[1, 2].map((i) => (
                <div key={i} className="flex justify-between items-end">
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-3 w-20" />
                    <Skeleton className="h-6 w-3/4" />
                  </div>
                  <Skeleton className="h-8 w-20 ml-4" />
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
