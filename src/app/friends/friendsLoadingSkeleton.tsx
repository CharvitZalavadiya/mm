"use client";
import { Skeleton } from "@/components/ui/skeleton";

const FriendsLoadingSkeleton = () => {
  const arr = [1, 2, 3, 4, 5, 6, 7, 8];

  return arr.map((index) => (
    <ul key={index} className="cssNotesGrid rounded-lg">
      <li
        key={index}
        className={`border border-navBlockBackground flex rounded-lg p-3`}
      >
        <Skeleton className="h-12 w-12 rounded-full animate-pulse bg-navBlockBackgroundHover mr-4" />
        <span className="w-4/6">
          <Skeleton className="h-4 w-1/2 rounded-full animate-pulse bg-navBlockBackgroundHover  relative top-1 mb-3" />
          <Skeleton className="h-3 w-3/2 rounded-full animate-pulse bg-navBlockBackgroundHover  relative top-1" />
        </span>
      </li>
    </ul>
  ));
};

export default FriendsLoadingSkeleton;
