"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useAuth, UserButton, useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";

const navLinks = [
  { href: "/flowcharts", icon: "account_tree", label: "Flow Charts", iconType: "rounded" },
  { href: "/notes", icon: "edit_note", label: "Notes", iconType: "outlined" },
  { href: "/friends", icon: "groups", label: "Friends", iconType: "outlined" },
  { href: "/favourites", icon: "star", label: "Favourites", iconType: "outlined" },
];

interface SideBarProps {
  onClose: () => void;
  isOpen: boolean;
}

export default function SideBar({ isOpen, onClose }: SideBarProps) {
  const { isLoaded, userId } = useAuth();
  const { user } = useUser();
  const pathname = usePathname();
  const [userDisplayName, setUserDisplayName] = useState("");
  const [isAnimating, setIsAnimating] = useState(false); // New state to track animation

  useEffect(() => {
    if (user) {
      setUserDisplayName(user.username || user.firstName || "");
    }
  }, [user]);

  const handleClose = () => {
    setIsAnimating(true); // Start the closing animation
    setTimeout(() => {
      setIsAnimating(false); // Reset the animation state
      onClose(); // Trigger the actual close function passed as a prop
    }, 500); // Match this duration to the length of the closing animation in CSS
  };

  if (!isLoaded || !userId || !user) {
    return null;
  }

  return (
    <span
      className={`cssSidebar p-3 rounded-lg flex h-fit bg-sidebarGradient flex-col select-none tracking-wide text-lg ${
        isOpen && !isAnimating ? "sidebarIncome" : isAnimating ? "sidebarOut" : ""
      }`}
    >
      <section className="text-lg font-semibold tracking-wider bg-headingTextGradient h-6 flex items-center justify-around w-full bg-clip-text text-transparent">
        <span>Mind Maps</span>
        <span
          className="material-symbols-outlined text-gray-400 text-3xl hidden cssMenuCloseButton hover:cursor-pointer"
          onClick={handleClose}
        >
          close
        </span>
      </section>

      <span className="w-full h-px rounded-full my-2 bg-dividerGradient"></span>

      <section className="w-full h-14 bg-navBlockBackground rounded-md p-3 text-ellipsis flex-wrap">
        <div className="w-full flex flex-wrap text-ellipsis whitespace-nowrap gap-3 items-center mx-3">
          <span className="flex border-2 border-slate-500 hover:bg-opacity-50 rounded-full">
            <UserButton afterSignOutUrl="/sign-in" />
          </span>
          <span className="flex select-none">{userDisplayName}</span>
        </div>
      </section>

      <section className="w-full h-auto text-nowrap bg-navBlockBackground rounded-md py-2 my-2">
        <ul className="mx-3">
          {navLinks.map(({ href, icon, label, iconType }) => (
            <Link key={href} href={href}>
              <li
                className={`flex items-center gap-3 my-2 px-3 hover:bg-navBlockBackgroundHover cursor-pointer p-2 rounded-md select-none ${
                  pathname === href
                    ? "bg-selectedFunctionalityBackgroundColor border border-stone-500"
                    : "bg-transparent"
                }`}
              >
                <span className={`material-symbols-${iconType}`}>{icon}</span>
                {label}
              </li>
            </Link>
          ))}
        </ul>
      </section>
    </span>
  );
}
