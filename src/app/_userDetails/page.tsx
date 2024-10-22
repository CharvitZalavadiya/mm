"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import SendFriendRequestLogo from "../../components/assets/user-avatar.png";
import Image from "next/image";
import { useAuth } from "@clerk/nextjs";
import axios from "axios";
import "./responsive.css";
import FriendRequestUsers from "../_friendRequestUsers/page";
import RequestedFriendsLoadingSkeleton from "../_friendRequestUsers/requestedFriendsLoadingSkeleton";
import FriendsLoadingSkeleton from "../friends/friendsLoadingSkeleton";

interface UserInfo {
  username: string | null;
  imageUrl: string;
  id: string;
  email: string | null;
  firstname: string | null;
  lastname: string | null;
}

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

interface UserDetailsProps {
  searchQuery: string;
  selectedTab: string;
}

const baseUrl = `https://mind-maps-backend.onrender.com`;

const UserDetails: React.FC<UserDetailsProps> = ({ searchQuery, selectedTab }) => {
  const [usersInfo, setUsersInfo] = useState<UserInfo[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<UserInfo[]>([]);
  // const [selectedTab, setSelectedTab] = useState("connectToMore");
  const popupRef = useRef<HTMLDivElement>(null);

  const { userId } = useAuth();

  const fetchUsers = () => {
    fetch("/api/getUsers")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch users");

        return res.json();
      })
      .then((users) => {
        setUsersInfo(users);
        setLoading(false);

        axios
          .post(`${baseUrl}/friends/bulk/:id`, { users })
          .then((res) => {
            console.log("response for multiple user request");
          })
          .catch((error) => {
            console.error("Error storing users in the database:", error);
          });
      })
      .catch((err) => {
        console.log("fail to fetch users", err);
      });
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    const currentUserData = usersInfo.find((user) => userId === user.id);
    if (currentUserData) {
      setCurrentUser([currentUserData]);
    }
  }, [usersInfo, userId]);

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

  const shuffleArray = (array: UserInfo[]) => {
    return array.sort(() => Math.random() - 0.5);
  };

  const filteredUsers = usersInfo
    .filter((user) => userId !== user.id)
    .filter(
      (user) =>
        user.username?.toLowerCase().includes(searchQuery.toLowerCase()) ??
        false
    );

  const shuffledUsers = shuffleArray(filteredUsers);
  const randomLimitedUsers = shuffledUsers.slice(0, 10);

  const openUserInfoPopup = async (user: UserInfo) => {
    setSelectedUser(user);

    await axios
      .post(`${baseUrl}/friends/`, currentUser)
      .then((res) => {
        console.log("response for single user request");
      })
      .catch((error) => {
        console.error("Error posting data:", error);
      });
  };

  const closeUserInfoPopup = () => {
    setSelectedUser(null);
  };

  const handleSendRequest = async () => {
    if (selectedUser) {
      try {
        const friendRequest = {
          fromUser: userId,
          toUser: selectedUser?.id,
        };

        if (selectedUser) {
          await axios.post(
            `${baseUrl}/friends/${friendRequest.toUser}`,
            friendRequest
          );
          console.log("friend request sent successfully");
        } else {
          console.log("No user has been selected");
        }

        closeUserInfoPopup();
      } catch (error) {
        console.log("Error occurred while sending request:", error);
      }
      window.location.reload();
    }
  };

  if (error) return <p>{error}</p>;

  return (
    <>
      <main className="text-2xl">
        <>
          {selectedTab === "requests" && (
            <Suspense fallback={<RequestedFriendsLoadingSkeleton />}>
              <FriendRequestUsers currentUser={currentUser} />
            </Suspense>
          )}  
        </>
        {selectedTab === "connectToMore" && (
          <>
            Connect with people
            <ul className="cssFriendsGrids grid grid-cols-3 gap-4 mt-4 h-[80%]">
              {loading ? (
                <FriendsLoadingSkeleton />
              ) : randomLimitedUsers.length > 0 ? (
                randomLimitedUsers.map((user) => (
                  <li
                    key={user.id}
                    className="w-full select-none hover:cursor-pointer"
                    onClick={() => openUserInfoPopup(user)}
                  >
                    <div className="flex p-2 border-[1.5px] border-stone-600 bg-selectedFunctionalityBackgroundColor hover:bg-navBlockBackground rounded-lg">
                      <span className="pr-4">
                        <Image
                          src={user.imageUrl}
                          alt={user.username || "No Username"}
                          width={56}
                          height={56}
                          className="max-w-14 border-[1.5px] border-slate-500 max-h-14 object-cover rounded-full"
                        />
                      </span>
                      <span className="w-4/6 overflow-hidden">
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
                <p className="text-3xl text-slate-400 w-[72vw] h-20 flex items-center">
                  No users found!
                </p>
              )}
            </ul>
          </>
        )}

        {selectedUser && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div
              ref={popupRef}
              className="h-2/4 bg-noteEditMode rounded-lg backdrop-blur-md p-4"
            >
              <div className="h-[85%] w-full flex flex-col">
                <span className="flex w-full gap-7">
                  <Image
                    src={selectedUser.imageUrl}
                    alt={selectedUser.username || "No Username"}
                    width={96}
                    height={96}
                    className="w-16 border-2 border-slate-500 h-16 object-cover select-none rounded-full"
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
              <div className="h-[15%] flex">
                <button
                  className="bg-blue-500 border flex-1 justify-center border-slate-300 inline-flex rounded-lg px-4 py-1 mr-4 hover:bg-blue-600 items-center"
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
      {/* <section className="fixed">
        <span className="cssButtonSize flex justify-around">
          <button
            className={`px-4 py-1 rounded ${
              selectedTab === "friends" ? "bg-blue-600" : "bg-gray-600"
            }`}
            onClick={() => setSelectedTab("friends")}
          >
            Friends
          </button>
          <button
            className={`px-4 py-1 rounded ${
              selectedTab === "requests" ? "bg-blue-600" : "bg-gray-600"
            }`}
            onClick={() => setSelectedTab("requests")}
          >
            Requests
          </button>
          <button
            className={`px-4 py-1 rounded ${
              selectedTab === "connectToMore" ? "bg-blue-600" : "bg-gray-600"
            }`}
            onClick={() => setSelectedTab("connectToMore")}
          >
            Connect
          </button>
        </span>
      </section> */}
    </>
  );
};

export default UserDetails;
