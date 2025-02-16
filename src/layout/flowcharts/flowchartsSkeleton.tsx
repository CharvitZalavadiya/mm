"use client";
import { Skeleton } from "@/components/ui/skeleton";
import "./responsive.css"

const FlowchartsSkeleton = () => {
  const arr = [1, 2, 3, 4, 5, 6];

  return arr.map((index) => (
    <ul key={index} className="cssFlowchartsGrid rounded-lg">
      <li
        key={index}
        className={`border border-navBlockBackground h-32 rounded-lg p-4`}
      >
        <Skeleton className="h-5 w-1/2 -z-10 rounded-full animate-pulse bg-navBlockBackgroundHover relative top-2/3 mb-3" />
      </li>
    </ul>
  ));
};

export default FlowchartsSkeleton;
