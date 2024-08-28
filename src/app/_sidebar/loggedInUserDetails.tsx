import { useAuth, UserButton, useUser } from "@clerk/nextjs";
import { Suspense, useEffect, useState } from "react";

export default function LoggedInUserDetails() {
  const { isLoaded, userId } = useAuth();
  const { user } = useUser();
  const [loading, setLoading] = useState<boolean>(true);
  const [userDisplayName, setUserDisplayName] = useState<String>("");

  useEffect(() => {
    try {
      if (user) {
        setUserDisplayName(user.username || user.firstName || "");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  if (!isLoaded || !userId || !user) {
    return null;
  }

  return (
    <section className="w-full h-14 bg-navBlockBackground rounded-md p-3 text-ellipsis flex-wrap">
      <div className="w-full flex flex-wrap text-ellipsis whitespace-nowrap gap-3 items-center mx-3">
        <Suspense fallback="Fetching Username">
          <span className="flex border-2 border-slate-500 hover:bg-opacity-50 rounded-full">
            <UserButton afterSignOutUrl="/sign-in" />
          </span>
          <span className="flex select-none">{userDisplayName}</span>
        </Suspense>
      </div>
    </section>
  );
}
