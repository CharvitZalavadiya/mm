"use client";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="w-full flex flex-col">
      <span className="flex justify-center">
        <Skeleton className="h-8 w-32 my-3 rounded-full animate-pulse bg-selectedFunctionalityBackgroundColor border-[1.5px] border-navBlockBackground" />
      </span>
      <span className="flex justify-end">
        <Skeleton className="h-8 w-48 my-1 rounded-lg animate-pulse bg-selectedFunctionalityBackgroundColor" />
      </span>
      <span className="flex justify-end">
        <Skeleton className="h-8 w-64 my-1 rounded-lg animate-pulse bg-selectedFunctionalityBackgroundColor" />
      </span>
      <span className="flex justify-start">
        <Skeleton className="h-8 w-32 my-1 rounded-lg animate-pulse bg-selectedFunctionalityBackgroundColor" />
      </span>
      <span className="flex justify-end">
        <Skeleton className="h-8 w-16 my-1 rounded-lg animate-pulse bg-selectedFunctionalityBackgroundColor" />
      </span>
      <span className="flex justify-start">
        <Skeleton className="h-8 w-24 my-1 rounded-lg animate-pulse bg-selectedFunctionalityBackgroundColor" />
      </span>
      <span className="flex justify-center">
        <Skeleton className="h-8 w-32 my-3 rounded-full animate-pulse bg-selectedFunctionalityBackgroundColor border-[1.5px] border-navBlockBackground" />
      </span>
      <span className="flex justify-start">
        <Skeleton className="h-8 w-28 my-1 rounded-lg animate-pulse bg-selectedFunctionalityBackgroundColor" />
      </span>
      <span className="flex justify-end">
        <Skeleton className="h-8 w-20 my-1 rounded-lg animate-pulse bg-selectedFunctionalityBackgroundColor" />
      </span>
    </div>
  );
}
