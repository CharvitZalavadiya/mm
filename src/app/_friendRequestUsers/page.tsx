"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import "./responsive.css";
import RequestedFriendsLoadingSkeleton from "./requestedFriendsLoadingSkeleton";

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

interface UserInfo {
  username: string | null;
  imageUrl: string;
  id: string;
  email: string | null;
  firstname: string | null;
  lastname: string | null;
}

interface FriendRequestUsersProps {
  currentUser: UserInfo[]; // Adjust this based on how you want to structure currentUser
}

const FriendRequestUsers: React.FC<FriendRequestUsersProps> = ({
  currentUser,
}) => {
  const [requestUsers, setRequestUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const popupRef = useRef<HTMLDivElement>(null);

  const fetchUsers = () => {
    fetch("api/requestedUser")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch friend request users cs");

        return res.json();
      })
      .then((users) => {
        setRequestUsers(users);
        setLoading(false);
      })
      .catch((err) => {
        console.log("failed to fetch friend request users", err);
      });
  };

  useEffect(() => {
    setTimeout(() =>{

      fetchUsers();
    }, 5000)
  }, []);

  const currentUserId = currentUser[0]?.id;

  // Separate requests into received and sent arrays
  const receivedRequests = requestUsers.filter(
    (user) =>
      user.requestSentPeople.length > 0 &&
      user.requestSentPeople.includes(currentUserId)
  );

  const sentRequests = requestUsers.filter(
    (user) =>
      user.requestReceivedPeople.length > 0 &&
      user.requestReceivedPeople.includes(currentUserId)
  );

  const openUserInfoPopup = async (user: User) => {
    setSelectedUser(user);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target as Node)
      ) {
        closeUserInfoPopup();
      }
    };

    if (selectedUser) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [selectedUser]);

  const closeUserInfoPopup = () => {
    setSelectedUser(null);
  };

  return (
    <>
      {/* Section for Requests Received */}
        <section className="overflow-hidden">
          <h3 className="text-2xl text-slate-100 mb-4">Requests Received</h3>
          <ul className="cssRequestedFriendsGrids grid grid-cols-3 gap-4 max-h-full">
            {loading ? (
              <RequestedFriendsLoadingSkeleton />
            ) : receivedRequests.length > 0 ? (
              receivedRequests.map((user) => (
                <li
                  key={user.id}
                  className="cssRequestPeopleCard select-none hover:cursor-pointer"
                  onClick={() => openUserInfoPopup(user)}
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
                      <h2 className="cssFriendsGridUsername text-xl text-slate-100 truncate">
                        {user.username || "No Username"}
                      </h2>
                      <h4 className="cssFriendsGridUserId text-sm text-slate-400 truncate">
                        {user.id || "No UserId"}
                      </h4>
                    </span>
                  </div>
                </li>
              ))
            ) : (
              <p className="text-xl text-slate-400 w-[72vw] h-20 flex items-center">
                No Received Requests
              </p>
            )}
          </ul>
        </section>

        {/* Section for Requests Sent */}
        <section className="mt-8">
          <h3 className="text-2xl text-slate-100 mb-4">Requests Sent</h3>
          <ul className="cssRequestedFriendsGrids grid grid-cols-3 gap-4 max-h-full">
            {loading ? (
              <RequestedFriendsLoadingSkeleton />
            ) : sentRequests.length > 0 ? (
              sentRequests.map((user) => (
                <li
                  key={user.id}
                  className="cssRequestPeopleCard select-none hover:cursor-pointer"
                  onClick={() => openUserInfoPopup(user)}
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
                      <h2 className="cssFriendsGridUsername text-xl text-slate-100 truncate">
                        {user.username || "No Username"}
                      </h2>
                      <h4 className="cssFriendsGridUserId text-sm text-slate-400 truncate">
                        {user.id || "No UserId"}
                      </h4>
                    </span>
                  </div>
                </li>
              ))
            ) : (
              <p className="text-xl text-slate-400 w-[72vw] h-20 flex items-center">
                No Sent Requests
              </p>
            )}
          </ul>
        </section>

      {selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div
            ref={popupRef}
            className="h-2/4 bg-noteEditMode rounded-lg backdrop-blur-md p-4 select-none"
          >
            <div className="h-[85%] w-full flex flex-col">
              <span className="flex w-full gap-7">
                <Image
                  src={selectedUser.imageUrl}
                  alt={selectedUser.username || "No Username"}
                  width={96}
                  height={96}
                  className="w-16 border-2 border-slate-500 h-16 object-cover rounded-full"
                />
                <span className="grid gap-1">
                  <p className="font-semibold text-2xl">
                    {selectedUser.username}
                  </p>
                  <p className="text-slate-300 gap-1 flex text-base">
                    <p>{selectedUser.firstname}</p>
                    <p>{selectedUser.lastname}</p>
                  </p>
                </span>
              </span>
              <span className="text-slate-300 mt-4 grid gap-2 ml-3 text-sm">
                <p>{selectedUser.email}</p>
                <p>{selectedUser.id}</p>
              </span>
            </div>
            <div className="h-[15%] flex text-sm">
              <span className="bg-blue-400 border border-slate-300 text-slate-300 inline-flex rounded-lg px-4 py-1 mr-4 items-center cursor-not-allowed">
                <span className="animate-spin w-4 h-4 border-2 border-t-transparent border-slate-300 rounded-full mr-2" />
                Pending
              </span>
              <button
                className="bg-transparent border border-slate-500 bg-zinc-600 items-center rounded-lg px-4 py-1 hover:bg-zinc-700 flex-1"
                onClick={closeUserInfoPopup}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FriendRequestUsers;
