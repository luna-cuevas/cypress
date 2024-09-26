"use client";
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
  ListItem,
  ListItemPrefix,
  Switch,
  ListItemSuffix,
} from "@material-tailwind/react";
import {
  EllipsisHorizontalCircleIcon,
  UserCircleIcon,
  ChevronDownIcon,
  LifebuoyIcon,
  PowerIcon,
  SunIcon,
  MoonIcon,
} from "@heroicons/react/24/solid";
import { arpona, trajanLight, trajanRegular } from "@/lib/fonts";
import { useAtom } from "jotai";
import { globalStateAtom } from "@/context/atoms";
import { useSupabase } from "@/lib/supabase";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

type Props = {};

// profile menu component
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

function ProfileMenu() {
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [state, setState] = useAtom(globalStateAtom);
  const supabase = useSupabase();
  const path = usePathname();
  const router = useRouter();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const handleSignOut = async () => {
    // Sign out from Supabase
    await supabase.auth.signOut();

    // Clear session and user from global state
    setState({
      ...state,
      customer: null,
    });

    console.log("Signed out successfully");

    // Close the menu
    closeMenu();
  };

  const closeMenu = () => setIsProfileMenuOpen(false);

  return (
    isLoaded && (
      <Menu
        allowHover
        open={isMenuOpen}
        handler={setIsMenuOpen}
        placement="bottom-end">
        <MenuHandler>
          <Button
            variant="text"
            color={state.darkMode ? "white" : "white"}
            className="lg:flex w-full hidden justify-center items-center gap-1 rounded-full py-[0.35rem] px-2 lg:ml-auto">
            {state.customer == null ? (
              <li
                className={`${
                  path == "/" ? "lg:text-white text-black" : "text-black"
                } relative font-normal justify-center group-hover:text-black dark:group-hover:text-white dark:text-gray-200 flex gap-2  uppercase text-sm box-content`}>
                Account
              </li>
            ) : state.user?.user_metadata.avatar_url ? (
              <Avatar
                variant="circular"
                size="sm"
                alt={state.user?.user_metadata.full_name || "Profile Picture"}
                className="p-0 w-[25px] h-auto"
                src={state.user?.user_metadata.avatar_url}
              />
            ) : (
              <EllipsisHorizontalCircleIcon
                className={`group-hover:text-gray-800 dark:group-hover:text-white dark:text-gray-200
                    ${path == "/" ? "lg:text-white text-black" : "text-black"}
                    w-6 h-6 `}
              />
            )}
          </Button>
        </MenuHandler>
        <MenuList
          className={`h-fit gap-4  overflow-hidden hidden rounded-none lg:flex lg:flex-col border-none ${
            state.darkMode ? "bg-cypress-green" : "bg-white"
          }`}>
          {state.customer == null ? (
            <div className="text-lg px-0 text-black gap-2 flex text-center  flex-col w-full h-full justify-center">
              <Link href="/login">
                <Typography
                  as="span"
                  variant="small"
                  className={`font-bold border-b py-1 border-gray-300 hover:bg-gray-200 ${
                    trajanLight.className
                  } ${state.darkMode ? "text-white" : "text-black"}`}>
                  Login
                </Typography>
              </Link>

              <Link href="/signup">
                <Typography
                  as="span"
                  variant="small"
                  className={`font-bold border-b py-1 border-gray-300 hover:bg-gray-200 ${
                    trajanLight.className
                  } ${state.darkMode ? "text-white" : "text-black"}`}>
                  Sign Up
                </Typography>
              </Link>
            </div>
          ) : (
            <>
              {profileMenuItems.map(
                (
                  {
                    label,
                    icon,
                    url,
                  }: {
                    label: string;
                    icon: any;
                    url?: string;
                  },
                  key
                ) => {
                  const isLastItem = key === profileMenuItems.length - 1;
                  return (
                    <MenuItem
                      key={label}
                      onClick={() => {
                        if (label === "Sign Out") {
                          handleSignOut();
                        } else {
                          if (url) {
                            router.push(url);
                          }
                          closeMenu();
                        }
                      }}
                      className={`flex items-center gap-2 rounded ${
                        isLastItem
                          ? "hover:bg-red-500 hover:bg-opacity-60  active:bg-opacity-80 focus:bg-red-500 active:bg-red-500"
                          : "hover:bg-opacity-60 active:bg-cypress-green-light  hover:bg-cypress-green-light"
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
                }
              )}
            </>
          )}
          <div className="lg:flex gap-3 hidden w-full justify-center  pb-2 px-2 items-center lg:mx-0 ">
            <SunIcon
              opacity={state.darkMode ? "0.5" : "1"}
              className={`text-black h-5 w-5  group-hover:text-black dark:text-white dark:group-hover:text-white`}
            />
            <Switch
              id="dark-mode"
              name="dark-mode"
              checked={state.darkMode}
              onChange={(event) => {
                setState({ ...state, darkMode: event.target.checked });
              }}
              crossOrigin={undefined}
            />
            <MoonIcon
              opacity={state.darkMode ? "1" : "0.3"}
              className={`text-black h-5 w-5 group-hover:text-black dark:text-white dark:group-hover:text-white`}
            />
          </div>
        </MenuList>
        <Accordion
          className="lg:hidden w-full   justify-center items-center border-b border-gray-200"
          open={isProfileMenuOpen}
          animate={{
            unmount: {
              height: "0px",
            },
          }}>
          <AccordionHeader
            onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
            className="hover:bg-opacity-60 items-center  pt-[9px] pb-2 px-2  hover:bg-cypress-green-light  w-full lg:py-[0.35rem] lg:hidden !flex justify-start lg:justify-center flex-grow  border-none">
            <ListItem
              className={`${
                path == "/" ? "lg:text-white text-black" : "text-black"
              }  relative hover:bg-transparent focus:bg-transparent group-hover:text-black dark:group-hover:text-white dark:text-gray-200 flex font-normal uppercase lg:font-bold  text-sm box-content`}>
              <ListItemPrefix>
                {state.customer == null ? (
                  <UserCircleIcon
                    className={` w-[25px]  h-auto text-gray-800 group-hover:text-gray-800 dark:group-hover:text-white dark:text-gray-200 `}
                  />
                ) : state.user?.user_metadata.avatar_url ? (
                  <Avatar
                    variant="circular"
                    size="sm"
                    alt={
                      state.user?.user_metadata.full_name || "Profile Picture"
                    }
                    className=" w-[25px] h-auto"
                    src={state.user?.user_metadata.avatar_url}
                  />
                ) : (
                  <EllipsisHorizontalCircleIcon className="w-6 h-6" />
                )}
              </ListItemPrefix>
              Account
              <ListItemSuffix>
                <ChevronDownIcon
                  strokeWidth={2}
                  className={`h-3 w-3 my-auto transition-transform ${
                    isProfileMenuOpen ? "rotate-180" : ""
                  }`}
                />
              </ListItemSuffix>
            </ListItem>
          </AccordionHeader>
          <AccordionBody className="w-full pt-[9px] pb-2">
            <ul className={`flex flex-col  w-full gap-2 px-auto my-1 `}>
              {state.customer == null ? (
                <MenuItem className="flex px-2 rounded-none hover:bg-opacity-60  hover:bg-cypress-green-light justify-left items-center ">
                  <ListItem
                    onClick={() => {
                      setState({
                        ...state,
                        isSignInOpen: true,
                        showMobileMenu: false,
                      });
                    }}
                    className={`${
                      path == "/" ? "lg:text-white text-black" : "text-black"
                    } ${
                      trajanRegular.className
                    } lg:underline-animation focus:bg-transparent hover:bg-transparent relative py-0 group-hover:text-black dark:group-hover:text-white dark:text-gray-200 flex uppercase text-xs box-content`}>
                    Sign In
                  </ListItem>
                </MenuItem>
              ) : (
                profileMenuItems &&
                profileMenuItems.map(({ label, url, icon }) => (
                  <MenuItem
                    key={label}
                    className="flex px-2 rounded-none hover:bg-opacity-60  hover:bg-cypress-green-light justify-left items-center ">
                    {label == "Sign Out" ? (
                      <ListItem
                        className={`${
                          path == "/"
                            ? "lg:text-white text-black"
                            : "text-black"
                        } ${
                          trajanRegular.className
                        } lg:underline-animation focus:bg-transparent hover:bg-transparent relative py-0 group-hover:text-black dark:group-hover:text-white dark:text-gray-200 flex uppercase text-xs box-content`}>
                        {label}
                      </ListItem>
                    ) : (
                      <Link href={url || "/"}>
                        <ListItem
                          className={`${
                            path == "/"
                              ? "lg:text-white text-black"
                              : "text-black"
                          } ${
                            trajanRegular.className
                          } lg:underline-animation focus:bg-transparent hover:bg-transparent py-0 relative group-hover:text-black dark:group-hover:text-white dark:text-gray-200 flex uppercase text-xs box-content`}>
                          {label}
                        </ListItem>
                      </Link>
                    )}
                  </MenuItem>
                ))
              )}
              <div className="flex gap-3 lg:hidden  w-full justify-center lg:py-[0.45rem] pt-[9px] pb-2 px-2 items-center lg:mx-0 ">
                <SunIcon
                  opacity={state.darkMode ? "0.5" : "1"}
                  className={`${
                    path == "/" ? "lg:text-white text-black" : "text-black"
                  } h-5 w-5  group-hover:text-black dark:text-white dark:group-hover:text-white`}
                />
                <Switch
                  id="dark-mode"
                  name="dark-mode"
                  checked={state.darkMode}
                  onChange={(event) => {
                    setState({ ...state, darkMode: event.target.checked });
                  }}
                  crossOrigin={undefined}
                />
                <MoonIcon
                  opacity={state.darkMode ? "1" : "0.3"}
                  className={`${
                    path == "/" ? "lg:text-white text-black" : "text-black"
                  } h-5 w-5 group-hover:text-black dark:text-white dark:group-hover:text-white`}
                />
              </div>
            </ul>
          </AccordionBody>
        </Accordion>
      </Menu>
    )
  );
}

export default ProfileMenu;
