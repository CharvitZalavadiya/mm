"use client";
import { Skeleton } from "@/components/ui/skeleton";
import "./animations.css"

const NotesLoadingSkeleton = () => {
  const arr = [1, 2, 3];

  return arr.map((index) => (
    <ul key={index} className="cssNotesGrid rounded-lg">
      <li
        key={index}
        className={`border border-navBlockBackground h-32 rounded-lg p-4`}
      >
        <Skeleton className="h-5 w-1/2 -z-10 rounded-full animate-pulse bg-navBlockBackgroundHover relative top-1/3 mb-3" />
        <Skeleton className="h-4 w-full -z-10 rounded-full animate-pulse bg-navBlockBackgroundHover relative top-1/3" />
      </li>
    </ul>
  ));
};

export default NotesLoadingSkeleton;
