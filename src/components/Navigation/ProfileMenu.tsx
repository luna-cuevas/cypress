"use client";
import React from "react";
import {
  Typography,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  ListItem,
  ListItemPrefix,
} from "@material-tailwind/react";
import {
  UserCircleIcon,
  LifebuoyIcon,
  PowerIcon,
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
  const { user, loading, signOut } = useAuth();
  const path = usePathname();
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  if (loading) return null;

  return (
    <Menu open={isMenuOpen} handler={setIsMenuOpen} placement="bottom-end">
      <MenuHandler>
        <MenuItem className="flex border-b px-2 lg:py-[0.35rem] rounded-none justify-start lg:justify-end items-center hover:bg-transparent focus:bg-transparent active:bg-transparent transition-all duration-200">
          <ListItem
            className={`${
              path === "/"
                ? "lg:text-white text-black dark:hover:text-white hover:text-white"
                : "text-black"
            } dark:text-white relative justify-center group-hover:text-black dark:group-hover:text-white  flex gap-2 uppercase text-sm box-content underline-animation hover:bg-transparent focus:bg-transparent active:bg-transparent w-fit lg:p-0`}>
            <ListItemPrefix className="lg:hidden">
              <UserCircleIcon className="h-5 w-5" />
            </ListItemPrefix>
            Account
          </ListItem>
        </MenuItem>
      </MenuHandler>
      <MenuList className="p-2 dark:bg-black border-gray-200 dark:border-gray-700">
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
                  }}
                  className={`flex items-center gap-2 rounded hover:bg-cypress-green-light/10 focus:bg-cypress-green-light/10 active:bg-cypress-green-light/10 ${
                    isLastItem
                      ? "hover:bg-red-500/10 focus:bg-red-500/10 active:bg-red-500/10"
                      : ""
                  }`}>
                  {React.createElement(icon, {
                    className: `h-4 w-4 ${
                      isLastItem
                        ? "text-red-500"
                        : "text-gray-900 dark:text-white"
                    }`,
                    strokeWidth: 2,
                  })}
                  <Typography
                    as="span"
                    variant="small"
                    className={`font-normal uppercase ${
                      isLastItem
                        ? "text-red-500"
                        : "text-gray-900 dark:text-white"
                    }`}>
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
      </MenuList>
    </Menu>
  );
}
