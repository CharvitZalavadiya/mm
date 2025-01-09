"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import "./responsive.css";
import RequestedFriendsLoadingSkeleton from "./requestedFriendsLoadingSkeleton";
import axios from "axios";

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
  currentUser: UserInfo[];
  searchQuery: string;
}

const baseUrl = `https://mind-maps-backend.onrender.com`;
const localUrl = `http://localhost:8080`;

const FriendRequestUsers: React.FC<FriendRequestUsersProps> = ({
  currentUser,
  searchQuery,
}) => {
  const [requestSentUsers, setRequestSentUsers] = useState<User[]>([]);
  const [requestReceivedUsers, setRequestReceivedUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedUserRequestSent, setSelectedUserRequestSent] =
    useState<User | null>(null);
  const [selectedUserRequestReceived, setSelectedUserRequestReceived] =
    useState<User | null>(null);
  const popupRef = useRef<HTMLDivElement>(null);

  const sUsers = () => {
    fetch(`${baseUrl}/api/friends/requestSent`, { cache: "no-store" })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch requestSent users");

        return res.json();
      })
      .then((users) => {
        setRequestSentUsers(users);
        setLoading(false);
      })
      .catch((err) => {
        console.log("failed to fetch friend request users", err);
      });
  };

  const rUsers = () => {
    fetch(`${baseUrl}/api/friends/requestReceived`, { cache: "no-store" })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch requestReceived users");

        return res.json();
      })
      .then((users) => {
        setRequestReceivedUsers(users);
        setLoading(false);
      })
      .catch((err) => {
        console.log("failed to fetch friend request users", err);
      });
  };

  useEffect(() => {
    sUsers();
    rUsers();
  }, []);

  const currentUserId = currentUser[0]?.id;

  const receivedRequests = requestReceivedUsers.filter(
    (user) =>
      user.username?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false
  );

  const sentRequests = requestSentUsers.filter(
    (user) =>
      user.username?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false
  );

  const openUserInfoPopupSent = async (user: User) => {
    setSelectedUser(user);
    setSelectedUserRequestSent(user);
  };

  const openUserInfoPopupReceived = async (user: User) => {
    setSelectedUser(user);
    setSelectedUserRequestReceived(user);
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
    setSelectedUserRequestSent(null);
    setSelectedUserRequestReceived(null);
  };

  const handleAcceptRequest = async () => {
    if (selectedUser && selectedUserRequestReceived) {
      try {
        const acceptRequest = {
          currentUser: currentUserId,
          friendUser: selectedUserRequestReceived?.id,
        };

        await axios
          .patch(`${baseUrl}/friends/acceptRequest/:id`, acceptRequest)
          .then((response) => {
            console.log(`Request accepted:`);
          })
          .catch((error) => {
            console.log(`Error accecpting request: ${error}`);
          });

        closeUserInfoPopup();
        // window.location.reload();
        sUsers();
    rUsers();
      } catch (error) {
        console.log(
          `error sending post request for accepting other user friend request: ${error}`
        );
      }
    }
  };

  const handleRevokeRequest = async () => {
    if (selectedUser && selectedUserRequestSent) {
      try {
        const revokeRequest = {
          currentUser: currentUserId,
          friendUser: selectedUserRequestSent?.id,
        };

        await axios
          .patch(`${baseUrl}/friends/revokeRequest/:id`, revokeRequest)
          .then((response) => {
            console.log(`Request revoked:`);
          })
          .catch((error) => {
            console.log(`Error revoking request: ${error}`);
          });

        closeUserInfoPopup();
        // window.location.reload();
        sUsers();
    rUsers();
      } catch (error) {
        console.log(
          `error sending post request for revokeing other user friend request: ${error}`
        );
      }
    }
  };

  const handleDeclineRequest = async () => {
    if (selectedUser && selectedUserRequestReceived) {
      try {
        const declineRequest = {
          currentUser: currentUserId,
          friendUser: selectedUserRequestReceived?.id,
        };

        await axios
          .patch(`${baseUrl}/friends/declineRequest/:id`, declineRequest)
          .then((response) => {
            console.log(`Request declined:`);
          })
          .catch((error) => {
            console.log(`Error declining request: ${error}`);
          });

        closeUserInfoPopup();
        // window.location.reload();
        sUsers();
    rUsers();
      } catch (error) {
        console.log(
          `error sending post request for declining other user friend request: ${error}`
        );
      }
    }
  };

  return (
    <>
      {/* Section for Requests Received */}
      <section className={`overflow-hidden`}>
        {/* <h3 className="cssRequestSentHeading text-2xl text-slate-100 mb-4">
          Requests Received
        </h3> */}
        <ul className="cssRequestedFriendsGrids grid grid-cols-3 gap-4 mt-4 max-h-full">
          {loading ? (
            <RequestedFriendsLoadingSkeleton />
          ) : receivedRequests.length > 0 ? (
            receivedRequests.map((user) => (
              <li
                key={user.id}
                className="cssRequestPeopleCard select-none hover:cursor-pointer"
                onClick={() => openUserInfoPopupReceived(user)}
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
            <p className="cssRequestSentHeading text-lg text-slate-400 w-[72vw] flex items-center">
              You havn&apos;t received the request
            </p>
          )}
        </ul>
      </section>

      {/* Section for Requests Sent */}
      <section className={`mt-8`}>
        <h3 className={`cssRequestSentHeading text-2xl text-slate-100 mb-4`}>
          Requests Sent
        </h3>
        <ul className="cssRequestedFriendsGrids grid grid-cols-3 gap-4 max-h-full">
          {loading ? (
            <RequestedFriendsLoadingSkeleton />
          ) : sentRequests.length > 0 ? (
            sentRequests.map((user) => (
              <li
                key={user.id}
                className="cssRequestPeopleCard select-none hover:cursor-pointer"
                onClick={() => openUserInfoPopupSent(user)}
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
            <p className="text-smFont text-slate-400 w-[72vw] flex items-center">
              You haven&apos;t sent any requests yet !
            </p>
          )}
        </ul>
      </section>

      {selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div
            ref={popupRef}
            className="bg-noteEditMode rounded-lg backdrop-blur-md p-4"
          >
            <div className="h-[85%] w-full flex flex-col">
              <span className="cssFriendsPopup flex w-full gap-7">
                <Image
                  src={selectedUser.imageUrl}
                  alt={selectedUser.username || "No Username"}
                  width={96}
                  height={96}
                  className="w-16 border-2 border-slate-500 h-16 object-cover select-none rounded-full"
                />
                <span className="cssFriendsPopupUsername grid gap-1">
                  <p className="font-semibold text-2xl">
                    {selectedUser.username}
                  </p>
                  <p className="text-slate-300 gap-1 flex text-base">
                    <p>{selectedUser.firstname}</p>
                    <p>{selectedUser.lastname}</p>
                  </p>
                </span>
              </span>
              <span className="cssFriendsPopupDetails text-slate-300 my-6 grid gap-2 truncate text-sm">
                <p>{selectedUser.email}</p>
                <p>{selectedUser.id}</p>
              </span>
            </div>
            <div className="cssFriendsPopupButtons h-[15%] flex text-sm">
              <button
                className={`bg-blue-400 border border-slate-300 text-slate-300 inline-flex rounded-lg px-4 py-1 mr-4 items-center cursor-not-allowed ${
                  selectedUserRequestSent ? "" : "hidden"
                } flex-1 justify-center`}
              >
                <span className="animate-spin w-4 h-4 border-2 border-t-transparent border-slate-300 rounded-full mr-2" />
                Pending
              </button>
              <button
                className={`bg-red-700 border border-red-500 text-slate-200 font-medium inline-flex rounded-lg px-4 py-1 mr-4 items-center cursor-pointer ${
                  selectedUserRequestSent ? "" : "hidden"
                } flex-1 justify-center`}
                onClick={handleRevokeRequest}
              >
                <span className="material-symbols-rounded">close</span>
                Revoke
              </button>
              <button
                className={`bg-blue-500 border border-slate-300 inline-flex rounded-lg py-1 mr-4 items-center cursor-pointer hover:bg-blue-600 flex-1 justify-center px-2 ${
                  selectedUserRequestReceived ? "" : "hidden"
                } flex-1`}
                onClick={handleAcceptRequest}
              >
                <span className="material-symbols-rounded pr-2">check</span>
                Accept
              </button>
              <button
                className={`bg-red-700 border border-red-500 text-slate-200 font-medium inline-flex rounded-lg px-4 py-1 mr-4 items-center cursor-pointer ${
                  selectedUserRequestReceived ? "" : "hidden"
                } flex-1 justify-center`}
                onClick={handleDeclineRequest}
              >
                <span className="material-symbols-rounded pr-2">close</span>
                Decline
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
    </>
  );
};

export default FriendRequestUsers;
