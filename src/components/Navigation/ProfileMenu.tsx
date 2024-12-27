"use client";
import React, { useState } from "react";
import {
  Typography,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  ListItem,
  ListItemPrefix,
  Collapse,
} from "@material-tailwind/react";
import {
  UserCircleIcon,
  LifebuoyIcon,
  PowerIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/solid";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

const profileMenuItems = [
  {
    label: "My Profile",
    icon: UserCircleIcon,
    url: "/account",
  },
  {
    label: "Help",
    icon: LifebuoyIcon,
    url: "/help",
  },
  {
    label: "Sign Out",
    icon: PowerIcon,
  },
];

export default function ProfileMenu() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { user, loading, signOut } = useAuth();
  const path = usePathname();
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  if (loading) return null;

  const hoverBackground =
    path === "/"
      ? "hover:bg-none hover:bg-opacity-0 dark:hover:text-white focus:text-white dark:hover:text-white/80 dark:focus:text-white/80"
      : "hover:text-black focus:text-black active:text-black dark:hover:text-white/80 dark:focus:text-white/80";

  const renderMenuItems = () => (
    <>
      {user ? (
        <>
          {profileMenuItems.map(({ label, icon, url }, key) => {
            const isLastItem = key === profileMenuItems.length - 1;
            return (
              <MenuItem
                key={label}
                onClick={() => {
                  if (label === "Sign Out") {
                    handleSignOut();
                  } else if (url) {
                    router.push(url);
                  }
                  setIsMenuOpen(false);
                  setIsMobileOpen(false);
                }}
                className="flex items-center gap-2 hover:bg-cypress-green-light/10 focus:bg-cypress-green-light/10 active:bg-cypress-green-light/10">
                {React.createElement(icon, {
                  className: "h-5 w-5 text-gray-900 dark:text-white",
                  strokeWidth: 2,
                })}
                <Typography
                  as="span"
                  variant="small"
                  className="font-normal uppercase text-gray-900 dark:text-white">
                  {label}
                </Typography>
              </MenuItem>
            );
          })}
        </>
      ) : (
        <>
          <Link href="/login">
            <MenuItem className="flex items-center gap-2 hover:bg-cypress-green-light/10 focus:bg-cypress-green-light/10 active:bg-cypress-green-light/10">
              <Typography
                variant="small"
                className="font-normal uppercase text-gray-900 dark:text-white">
                Login
              </Typography>
            </MenuItem>
          </Link>
          <Link href="/signup">
            <MenuItem className="flex items-center gap-2 hover:bg-cypress-green-light/10 focus:bg-cypress-green-light/10 active:bg-cypress-green-light/10">
              <Typography
                variant="small"
                className="font-normal uppercase text-gray-900 dark:text-white">
                Sign Up
              </Typography>
            </MenuItem>
          </Link>
        </>
      )}
    </>
  );

  return (
    <>
      {/* Mobile Menu */}
      <div className="lg:hidden justify-center hover:bg-transparent focus:bg-transparent active:bg-transparent h-fit w-full mx-auto lg:m-0 border-b border-gray-200 lg:border-none">
        <MenuItem
          className={`hover:bg-transparent focus:bg-transparent active:bg-transparent flex px-2 lg:py-[0.35rem] rounded-none justify-start lg:justify-end items-center ${hoverBackground} transition-all duration-200`}>
          <ListItem
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            className={`${
              path === "/"
                ? "lg:text-white text-black dark:text-white"
                : "text-black dark:text-white"
            } ${hoverBackground} hover:bg-transparent focus:bg-transparent active:bg-transparent focus:outline-none underline-animation w-fit lg:p-0 relative flex uppercase text-sm box-content transition-all duration-200`}>
            {" "}
            <ListItemPrefix>
              <UserCircleIcon className="h-5 w-5" />
            </ListItemPrefix>
            Account
            <ChevronDownIcon
              className={`h-4 w-4 transition-transform ${
                isMobileOpen ? "rotate-180" : ""
              }`}
            />
          </ListItem>
        </MenuItem>
        <Collapse open={isMobileOpen}>
          <div className="pl-8 pr-4 py-2">{renderMenuItems()}</div>
        </Collapse>
      </div>

      {/* Desktop Menu */}
      <div className="hidden lg:block">
        <Menu open={isMenuOpen} handler={setIsMenuOpen} placement="bottom-end">
          <MenuHandler>
            <MenuItem className="flex  border-b px-2 lg:py-[0.35rem] rounded-none justify-end items-center hover:bg-transparent focus:bg-transparent active:bg-transparent">
              <ListItem
                className={`${
                  path === "/"
                    ? "lg:text-white text-black dark:hover:text-white hover:text-white"
                    : "text-black"
                } dark:text-white relative justify-center group-hover:text-black dark:group-hover:text-white flex gap-2 uppercase text-sm box-content underline-animation hover:bg-transparent focus:bg-transparent active:bg-transparent w-fit lg:p-0`}>
                Account
              </ListItem>
            </MenuItem>
          </MenuHandler>
          <MenuList className="p-2 border-gray-200 dark:border-gray-700 dark:bg-black">
            {renderMenuItems()}
          </MenuList>
        </Menu>
      </div>
    </>
  );
}
