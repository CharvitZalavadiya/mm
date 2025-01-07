"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useUserContext } from "@/context/UserContext";
import RequestedFriendsLoadingSkeleton from "../friendRequestUsers/requestedFriendsLoadingSkeleton";

interface User {
  username: string;
  imageUrl: string;
  id: string;
  email: string;
  firstname: string;
  lastname: string;
  connectedPeople: string[];
  requestSentPeople: string[];
  requestReceivedPeople: string[];
}

interface ConnectedFriendsProps {
  // currentUser: UserInfo[];
  searchQuery: string;
}

const baseUrl = "https://mind-maps-backend.onrender.com";

const ConnectedFriends: React.FC<ConnectedFriendsProps> = ({
  // currentUser,
  searchQuery,
}) => {
  const [connectedUsers, setConnectedUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { setSelectedUser, setLoggedinUser } = useUserContext();
  const router = useRouter();

  const { selectedUser, loggedinUser } = useUserContext();

  const fetchUsers = () => {
    fetch(`${baseUrl}/api/friends/connected`, { cache: 'no-store' })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch friend request users");
        return res.json();
      })
      .then((users) => {
        setConnectedUsers(users);
        setLoading(false);
      })
      .catch((err) =>
        console.error("Failed to fetch friend request users", err)
      );
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const connectedFriends = connectedUsers.filter(
    (user) =>
      user.username?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false
  );

  const handleFriendForChat = (user: User) => {
    setSelectedUser(user);
    router.push("/friends/chat");
  };

  return (
    <section className="overflow-hidden">
      <ul className="cssRequestedFriendsGrids grid grid-cols-3 mt-4 gap-4 max-h-full">
        {loading ? (
          <RequestedFriendsLoadingSkeleton />
        ) : connectedFriends.length > 0 ? (
          connectedFriends.map((user) => (
            <li
              key={user.id}
              className="cssRequestPeopleCard select-none hover:cursor-pointer"
              onClick={() => handleFriendForChat(user)}
            >
              <div className="grid place-items-center p-2 border-[1.5px] border-stone-600 bg-selectedFunctionalityBackgroundColor hover:bg-navBlockBackground rounded-lg w-full">
                <span className="mb-4">
                  <Image
                    src={user.imageUrl}
                    alt={user.username || "No Username"}
                    width={56}
                    height={56}
                    className="max-w-14 border-[1.5px] border-slate-500 max-h-14 object-cover rounded-full"
                  />
                </span>
                <span className="w-5/6 overflow-hidden">
                  <h2 className="cssFriendsGridUsername text-center text-xl text-slate-100 truncate">
                    {user.username || "No Username"}
                  </h2>
                  <h4 className="text-sm text-slate-400 w-full text-center truncate">
                    {user.firstname || "No firstname"}{" "}
                    {user.lastname || "No lastname"}
                  </h4>
                </span>
              </div>
            </li>
          ))
        ) : (
          <p className="cssRequestSentHeading text-xl text-slate-400 w-[72vw] h-20 flex items-center">
            Don&apos;t have friends? <br />
            Connect with people
          </p>
        )}
      </ul>
    </section>
  );
};

export default ConnectedFriends;
