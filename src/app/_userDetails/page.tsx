"use client";

import { useEffect, useRef, useState } from "react";
import SendFriendRequestLogo from "../../components/assets/user-avatar.png";
import Image from "next/image";
import { useAuth } from "@clerk/nextjs";
import axios from "axios";

interface UserInfo {
  username: string | null;
  imageUrl: string;
  id: string;
  email: string | null;
}

interface UserDetailsProps {
  searchQuery: string;
}

const UserDetails: React.FC<UserDetailsProps> = ({ searchQuery }) => {
  const [usersInfo, setUsersInfo] = useState<UserInfo[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const popupRef = useRef<HTMLDivElement>(null);

  const { userId } = useAuth();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("/api/getUsers");
        if (!response.ok) throw new Error("Failed to fetch users");

        const data: UserInfo[] = await response.json();
        setUsersInfo(data);
      } catch (err) {
        console.error("Error fetching users:", err);
        setError("Failed to load user details");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

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

  const filteredUsers = usersInfo
    .filter((user) => userId !== user.id)
    .filter(
      (user) =>
        user.username?.toLowerCase().includes(searchQuery.toLowerCase()) ??
        false
    );

  const openUserInfoPopup = (user: UserInfo) => {
    setSelectedUser(user);
  };

  const closeUserInfoPopup = () => {
    setSelectedUser(null);
  };

  const handleSendRequest = async () => {
    try {
      const friendRequest = {
        fromUser: userId,
        toUser: selectedUser?.id,
      };

      if (selectedUser) {
        await axios.post(
          `http://localhost:8080/friends/${selectedUser.id}`,
          friendRequest
        );
      } else {
        console.log(`No user has been selected`);
      }

      closeUserInfoPopup();
    } catch (error) {
      console.log(`Error occured while sending request : ${error}`);
    }

    console.log(`button clicked`);
  };

  if (loading) return <p>Loading user details...</p>;
  if (error) return <p>{error}</p>;

  return (
    <main>
      <div className="text-2xl select-none">
        Connect with people
        <ul className="grid grid-cols-3 gap-4 mt-4 max-h-full overflow-y-scroll">
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user) => (
              <li
                key={user.id}
                className="w-full select-none hover:cursor-pointer"
                onClick={() => openUserInfoPopup(user)}
              >
                <div className="flex p-2 border-[1.5px] border-stone-600 bg-selectedFunctionalityBackgroundColor hover:bg-navBlockBackground rounded-lg">
                  <span className=" pr-4">
                    <img
                      src={user.imageUrl}
                      alt={user.username || "No Username"}
                      className="w-14 border-[1.5px] border-slate-500 h-14 object-cover rounded-full"
                    />
                  </span>
                  <span className="w-4/6">
                    <h2 className="text-xl text-slate-100 truncate">
                      {user.username || "No Username"}
                    </h2>
                    <h4 className="text-sm text-slate-400 truncate">
                      {user.id || "No UserId"}
                    </h4>
                  </span>
                </div>
              </li>
            ))
          ) : (
            <p className="text-3xl text-slate-400 w-[72vw] h-20 flex items-center">
              No users found !
            </p>
          )}
        </ul>
      </div>

      {selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div
            ref={popupRef}
            className="w-4/12 h-2/4 bg-noteEditMode rounded-lg backdrop-blur-md p-4 select-none"
          >
            <div className="h-[85%] w-full flex flex-col items-center">
              <img
                src={selectedUser.imageUrl}
                alt={selectedUser.username || "No Username"}
                className="w-24 border-2 border-slate-500 h-24 object-cover rounded-full"
              />
              <span className="flex flex-col w-full justify-around items-center mb-10">
                <h2 className="text-3xl w-fit mb-4 truncate">
                  {selectedUser.username || "No Username"}
                </h2>
                <h4 className="text-sm w-full text-center mb-1 text-slate-300 truncate">
                  {selectedUser.email || "No EmailAddress"}
                </h4>
                <h4 className="text-sm w-full text-center text-slate-300 truncate">
                  {selectedUser.id || "No UserId"}
                </h4>
              </span>
            </div>
            <div className="h-[15%] flex justify-evenly">
              <button
                className="bg-blue-500 border border-slate-300 inline-flex rounded-lg px-4 py-1 mr-8 hover:bg-blue-600 items-center"
                onClick={handleSendRequest}
              >
                Send Request
                <Image
                  src={SendFriendRequestLogo}
                  alt="Send Friend Request"
                  width={24}
                  height={24}
                  className="ml-2"
                />
              </button>
              <button
                className="bg-transparent border border-slate-500 bg-zinc-600 items-center rounded-lg px-4 py-1 hover:bg-zinc-700"
                onClick={closeUserInfoPopup}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default UserDetails;
