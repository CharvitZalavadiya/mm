"use client"
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="flex bg-primaryBackground w-full pl-1/5 h-screen items-center justify-center space-x-4">
      <Skeleton className="h-[95vh] w-[220px] rounded-lg animate-pulse bg-navBlockBackground" />
      <Skeleton className="h-[95vh] rounded-lg animate-pulse bg-navBlockBackground" />
    </div>
  );
}
