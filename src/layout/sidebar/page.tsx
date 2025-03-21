"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Suspense, useState } from "react";
import LoggedInUserDetails from "./loggedInUserDetails";
import "./animations.css"

const navLinks = [
  {
    href: "/flowcharts",
    icon: "account_tree",
    label: "Flowcharts",
    iconType: "rounded",
  },
  { href: "/notes", icon: "edit_note", label: "Notes", iconType: "outlined" },
  { href: "/friends", icon: "groups", label: "Friends", iconType: "outlined" },
  // {
  //   href: "/favourites",
  //   icon: "star",
  //   label: "Favourites",
  //   iconType: "outlined",
  // },
];

interface SideBarProps {
  onClose: () => void;
  isOpen: boolean;
}

export default function SideBar({ isOpen, onClose }: SideBarProps) {
  const pathname = usePathname();
  const [isAnimating, setIsAnimating] = useState<boolean>(false);

  const handleClose = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setIsAnimating(false);
      onClose();
    }, 500);
  };

  return (
    <Suspense fallback="sidebar comming">
      <span
        className={`cssSidebar w-[220px] p-3 rounded-lg flex flex-grow bg-sidebarGradient flex-col select-none tracking-wide text-lg h-[95dvh] ${
          isOpen && !isAnimating
            ? "sidebarIncome"
            : isAnimating
            ? "sidebarOut"
            : ""
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

        <section className="w-full text-nowrap bg-navBlockBackground flex-grow rounded-md py-2 my-2">
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
        <LoggedInUserDetails />
      </span>
    </Suspense>
  );
}
