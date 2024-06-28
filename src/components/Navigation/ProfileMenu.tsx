import React, { useEffect, useState } from "react";
import {
  Typography,
  Button,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Avatar,
  AccordionHeader,
  AccordionBody,
  Accordion,
} from "@material-tailwind/react";
import {
  EllipsisHorizontalCircleIcon,
  UserCircleIcon,
  ChevronDownIcon,
  LifebuoyIcon,
  PowerIcon,
} from "@heroicons/react/24/solid";
import { trajanLight, trajanRegular } from "@/lib/fonts";
import { useAtom } from "jotai";
import { globalStateAtom } from "@/context/atoms";
import { useSupabase } from "@/lib/supabase";
import Link from "next/link";
import { usePathname } from "next/navigation";

type Props = {};

// profile menu component
const profileMenuItems = [
  {
    label: "My Profile",
    icon: UserCircleIcon,
    url: "/profile",
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

function ProfileMenu() {
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [state, setState] = useAtom(globalStateAtom);
  const supabase = useSupabase();
  const path = usePathname();

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

  const closeMenu = () => setIsProfileMenuOpen(false);

  return (
    <Menu open={isMenuOpen} handler={setIsMenuOpen} placement="bottom-end">
      <MenuHandler>
        <Button
          variant="text"
          color={state.darkMode ? "white" : "white"}
          className="lg:flex w-full hidden justify-center items-center gap-1 rounded-full py-[0.35rem] px-2 lg:ml-auto">
          {state.session == null ? (
            <UserCircleIcon
              className={`p-0 w-[25px] mx-auto h-auto text-gray-800 group-hover:text-gray-800 dark:group-hover:text-white dark:text-gray-200 `}
            />
          ) : state.user?.user_metadata.avatar_url ? (
            <Avatar
              variant="circular"
              size="sm"
              alt={state.user?.user_metadata.full_name || "Profile Picture"}
              className="p-0 w-[25px] h-auto"
              src={state.user?.user_metadata.avatar_url}
            />
          ) : (
            <EllipsisHorizontalCircleIcon className="w-6 h-6 text-gray-600 dark:text-white" />
          )}
        </Button>
      </MenuHandler>
      <MenuList
        className={`p-1 hidden lg:flex lg:flex-col border-none ${
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
      <Accordion
        className="lg:hidden w-full  justify-center items-center gap-2 border-b border-gray-200"
        open={isProfileMenuOpen}
        animate={{
          unmount: {
            height: "0px",
          },
        }}>
        <AccordionHeader
          onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
          className="hover:bg-opacity-80 items-center focus:bg-cypress-green-light pt-[9px] pb-2 px-2 active:bg-cypress-green-light hover:bg-cypress-green-light mx-auto w-full lg:py-[0.35rem] lg:hidden flex justify-center flex-grow  ml-2 border-none">
          <li
            className={`${
              path == "/" ? "lg:text-white text-black" : "text-black"
            }  relative group-hover:text-black dark:group-hover:text-white dark:text-gray-200 flex gap-1 font-bold uppercase text-sm box-content`}>
            {state.session == null ? (
              <UserCircleIcon
                className={`p-0 w-[25px] mx-auto h-auto text-gray-800 group-hover:text-gray-800 dark:group-hover:text-white dark:text-gray-200 `}
              />
            ) : state.user?.user_metadata.avatar_url ? (
              <Avatar
                variant="circular"
                size="sm"
                alt={state.user?.user_metadata.full_name || "Profile Picture"}
                className="p-0 w-[25px] h-auto"
                src={state.user?.user_metadata.avatar_url}
              />
            ) : (
              <EllipsisHorizontalCircleIcon className="w-6 h-6" />
            )}
            <ChevronDownIcon
              strokeWidth={2}
              className={`h-3 w-3 my-auto transition-transform ${
                isProfileMenuOpen ? "rotate-180" : ""
              }`}
            />
          </li>
        </AccordionHeader>
        <AccordionBody className="w-full pt-[9px] pb-2">
          <ul className={`flex flex-col  w-full gap-2 px-auto my-1 `}>
            {profileMenuItems &&
              profileMenuItems.map(({ label, url }) => (
                <MenuItem
                  key={label}
                  className="flex px-2 rounded-none hover:bg-opacity-80  active:bg-cypress-green-light focus:bg-cypress-green-light hover:bg-cypress-green-light justify-center lg:justify-left items-center ">
                  {label == "Sign Out" ? (
                    <li
                      className={`${
                        path == "/" ? "lg:text-white text-black" : "text-black"
                      } ${
                        trajanRegular.className
                      } underline-animation relative group-hover:text-black dark:group-hover:text-white dark:text-gray-200 flex uppercase text-xs box-content`}>
                      {label}
                    </li>
                  ) : (
                    <Link href={url || "/"}>
                      <li
                        className={`${
                          path == "/"
                            ? "lg:text-white text-black"
                            : "text-black"
                        } ${
                          trajanRegular.className
                        } underline-animation relative group-hover:text-black dark:group-hover:text-white dark:text-gray-200 flex uppercase text-xs box-content`}>
                        {label}
                      </li>
                    </Link>
                  )}
                </MenuItem>
              ))}
          </ul>
        </AccordionBody>
      </Accordion>
    </Menu>
  );
}

export default ProfileMenu;
