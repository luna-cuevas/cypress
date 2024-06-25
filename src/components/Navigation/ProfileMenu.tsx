import React, { useEffect, useState } from "react";
import {
  Navbar,
  Collapse,
  Typography,
  Button,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Avatar,
  Card,
  IconButton,
  Switch,
} from "@material-tailwind/react";
import {
  CubeTransparentIcon,
  UserCircleIcon,
  CodeBracketSquareIcon,
  Square3Stack3DIcon,
  ChevronDownIcon,
  Cog6ToothIcon,
  InboxArrowDownIcon,
  LifebuoyIcon,
  PowerIcon,
  RocketLaunchIcon,
  Bars2Icon,
  MoonIcon,
  SunIcon,
} from "@heroicons/react/24/solid";
import { trajanLight } from "@/lib/fonts";
import { useAtom } from "jotai";
import { globalStateAtom } from "@/context/atoms";
import { useSupabase } from "@/lib/supabase";

type Props = {};

// profile menu component
const profileMenuItems = [
  {
    label: "My Profile",
    icon: UserCircleIcon,
  },
  {
    label: "Edit Profile",
    icon: Cog6ToothIcon,
  },
  {
    label: "Help",
    icon: LifebuoyIcon,
  },
  {
    label: "Sign Out",
    icon: PowerIcon,
  },
];

function ProfileMenu() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [state, setState] = useAtom(globalStateAtom);
  const supabase = useSupabase();

  const handleSignOut = async () => {
    // Sign out from Supabase
    await supabase.auth.signOut();

    // Clear session and user from global state
    setState({
      ...state,
      session: null,
      user: null,
    });

    console.log("Signed out successfully");

    // Close the menu
    closeMenu();
  };

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <Menu open={isMenuOpen} handler={setIsMenuOpen} placement="bottom-end">
      <MenuHandler>
        <Button
          variant="text"
          color={state.darkMode ? "white" : "white"}
          className="flex w-full  items-center gap-1 rounded-full py-[0.35rem] px-2 lg:ml-auto">
          {state.session == null ? (
            <UserCircleIcon
              className={`p-0 w-[25px] h-auto text-gray-800 group-hover:text-gray-800 dark:group-hover:text-white dark:text-gray-200 `}
            />
          ) : (
            <Avatar
              variant="circular"
              size="sm"
              alt="tania andrew"
              className="p-0 w-[25px] h-auto"
              src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1480&q=80"
            />
          )}
        </Button>
      </MenuHandler>
      <MenuList
        className={`p-1 border-none ${
          state.darkMode ? "bg-cypress-green" : "bg-white"
        }`}>
        {state.session == null ? (
          <div className="p-4 flex w-full h-full justify-center">
            <Button
              variant="filled"
              className={`w-ful hover:shadow-none shadow-none hover:scale-110 text-black bg-gray-300 group-hover:bg-gray-800 dark:group-hover:bg-white dark:bg-gray-300`}
              onClick={() => {
                setState({ ...state, isSignInOpen: true });
              }}>
              Sign In
            </Button>
          </div>
        ) : (
          profileMenuItems.map(({ label, icon }, key) => {
            const isLastItem = key === profileMenuItems.length - 1;
            return (
              <MenuItem
                key={label}
                onClick={label === "Sign Out" ? handleSignOut : closeMenu}
                className={`flex items-center gap-2 rounded ${
                  isLastItem
                    ? "hover:bg-red-500 hover:bg-opacity-80 focus:bg-opacity-80 active:bg-opacity-80 focus:bg-red-500 active:bg-red-500"
                    : "hover:bg-opacity-80 active:bg-cypress-green-light focus:bg-cypress-green-light hover:bg-cypress-green-light"
                }`}>
                {React.createElement(icon, {
                  className: `h-4 w-4 ${
                    state.darkMode ? "text-white" : "text-black"
                  }`,
                  strokeWidth: 2,
                })}
                <Typography
                  as="span"
                  variant="small"
                  className={`font-bold ${trajanLight.className} ${
                    state.darkMode ? "text-white" : "text-black"
                  }`}>
                  {label}
                </Typography>
              </MenuItem>
            );
          })
        )}
      </MenuList>
    </Menu>
  );
}

export default ProfileMenu;
