"use client";
import { Skeleton } from "@/components/ui/skeleton";

const RequestedFriendsLoadingSkeleton = () => {
  const arr = [1, 2, 3, 4, 5, 6];

  return arr.map((index) => (
    <ul key={index} className="cssRequestedFriendsGrids rounded-lg">
      <li
        key={index}
        className={`cssRequestPeopleCard border border-navBlockBackground rounded-lg p-2`}
      >
        <div className="w-5/6 grid place-items-center">
          <Skeleton className="h-14 w-14 mb-3 rounded-full animate-pulse bg-navBlockBackgroundHover" />
          <span className="w-5/6 grid place-items-center grid-rows-2">
            <Skeleton className="h-4 w-1/2 rounded-full animate-pulse bg-navBlockBackgroundHover" />
            <Skeleton className="h-3 w-5/6 rounded-full animate-pulse bg-navBlockBackgroundHover mt-2" />
          </span>
        </div>
      </li>
    </ul>
  ));
};

export default RequestedFriendsLoadingSkeleton;
