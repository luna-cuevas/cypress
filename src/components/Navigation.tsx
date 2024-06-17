"use client";
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

import Image from "next/image";
import { globalStateAtom } from "@/context/atoms";
import { useAtom } from "jotai";
import {
  sedan,
  arpona,
  trajan,
  trajanRegular,
  trajanLight,
} from "../lib/fonts";
import Link from "next/link";

// // profile menu component
// const profileMenuItems = [
//   {
//     label: "My Profile",
//     icon: UserCircleIcon,
//   },
//   {
//     label: "Edit Profile",
//     icon: Cog6ToothIcon,
//   },
//   {
//     label: "Inbox",
//     icon: InboxArrowDownIcon,
//   },
//   {
//     label: "Help",
//     icon: LifebuoyIcon,
//   },
//   {
//     label: "Sign Out",
//     icon: PowerIcon,
//   },
// ];

// function ProfileMenu() {
//   const [isMenuOpen, setIsMenuOpen] = React.useState(false);

//   const closeMenu = () => setIsMenuOpen(false);

//   return (
//     <Menu open={isMenuOpen} handler={setIsMenuOpen} placement="bottom-end">
//       <MenuHandler>
//         <Button
//           variant="text"
//           color="blue-gray"
//           className="flex items-center gap-1 rounded-full py-0.5 pr-2 pl-0.5 lg:ml-auto">
//           <Avatar
//             variant="circular"
//             size="sm"
//             alt="tania andrew"
//             className="border border-gray-900 p-0.5"
//             src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1480&q=80"
//           />
//           <ChevronDownIcon
//             strokeWidth={2.5}
//             className={`h-3 w-3 transition-transform ${
//               isMenuOpen ? "rotate-180" : ""
//             }`}
//           />
//         </Button>
//       </MenuHandler>
//       <MenuList className="p-1">
//         {profileMenuItems.map(({ label, icon }, key) => {
//           const isLastItem = key === profileMenuItems.length - 1;
//           return (
//             <MenuItem
//               key={label}
//               onClick={closeMenu}
//               className={`flex items-center gap-2 rounded ${
//                 isLastItem
//                   ? "hover:bg-red-500/10 focus:bg-red-500/10 active:bg-red-500/10"
//                   : ""
//               }`}>
//               {React.createElement(icon, {
//                 className: `h-4 w-4 ${isLastItem ? "text-red-500" : ""}`,
//                 strokeWidth: 2,
//               })}
//               <Typography
//                 as="span"
//                 variant="small"
//                 className="font-normal"
//                 color={isLastItem ? "red" : "inherit"}>
//                 {label}
//               </Typography>
//             </MenuItem>
//           );
//         })}
//       </MenuList>
//     </Menu>
//   );
// }

// // nav list menu
// const navListMenuItems = [
//   {
//     title: "@material-tailwind/html",
//     description:
//       "Learn how to use @material-tailwind/html, packed with rich components and widgets.",
//   },
//   {
//     title: "@material-tailwind/react",
//     description:
//       "Learn how to use @material-tailwind/react, packed with rich components for React.",
//   },
//   {
//     title: "Material Tailwind PRO",
//     description:
//       "A complete set of UI Elements for building faster websites in less time.",
//   },
// ];

// function NavListMenu() {
//   const [isMenuOpen, setIsMenuOpen] = React.useState(false);

//   const renderItems = navListMenuItems.map(({ title, description }) => (
//     <a href="#" key={title}>
//       <MenuItem>
//         <Typography variant="h6" color="blue-gray" className="mb-1">
//           {title}
//         </Typography>
//         <Typography variant="small" color="gray" className="font-normal">
//           {description}
//         </Typography>
//       </MenuItem>
//     </a>
//   ));

//   return (
//     <React.Fragment>
//       <Menu allowHover open={isMenuOpen} handler={setIsMenuOpen}>
//         <MenuHandler>
//           <Typography as="a" href="#" variant="small" className="font-normal">
//             <MenuItem className="hidden items-center gap-2 font-medium text-blue-gray-900 lg:flex lg:rounded-full">
//               <Square3Stack3DIcon className="h-[18px] w-[18px] text-blue-gray-500" />{" "}
//               Pages{" "}
//               <ChevronDownIcon
//                 strokeWidth={2}
//                 className={`h-3 w-3 transition-transform ${
//                   isMenuOpen ? "rotate-180" : ""
//                 }`}
//               />
//             </MenuItem>
//           </Typography>
//         </MenuHandler>
//         <MenuList className="hidden w-[36rem] grid-cols-7 gap-3 overflow-visible lg:grid">
//           <Card
//             color="blue"
//             shadow={false}
//             variant="gradient"
//             className="col-span-3 grid h-full w-full place-items-center rounded-md">
//             <RocketLaunchIcon strokeWidth={1} className="h-28 w-28" />
//           </Card>
//           <ul className="col-span-4 flex w-full flex-col gap-1">
//             {renderItems}
//           </ul>
//         </MenuList>
//       </Menu>
//       <MenuItem className="flex items-center gap-2 font-medium text-blue-gray-900 lg:hidden">
//         <Square3Stack3DIcon className="h-[18px] w-[18px] text-blue-gray-500" />{" "}
//         Pages{" "}
//       </MenuItem>
//       <ul className="ml-6 flex w-full flex-col gap-1 lg:hidden">
//         {renderItems}
//       </ul>
//     </React.Fragment>
//   );
// }

// nav list component
const navListItems = [
  // {
  //   label: "Home",
  //   icon: CubeTransparentIcon,
  //   url: "/",
  // },
  {
    label: "Shop",
    icon: UserCircleIcon,
    url: "/shop",
  },
  {
    label: "About",
    icon: CubeTransparentIcon,
    url: "/about",
  },
  {
    label: "Contact",
    icon: CodeBracketSquareIcon,
    url: "/contact",
  },
  {
    label: "Cart",
    icon: Square3Stack3DIcon,
  },
];

function NavList({ isNavOpen }: { isNavOpen?: boolean }) {
  const [state, setState] = useAtom(globalStateAtom);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", state.darkMode);
  }, [state.darkMode]);

  return (
    <ul className="z-[10000] border-t border-gray-200 lg:border-t-0  flex max-w-screen lg:w-screen lg:h-[90px] bg-none justify-between flex-col gap-2  lg:flex-row lg:items-center">
      {/* <NavListMenu /> */}

      <div className="lg:w-[80%] w-full    m-auto h-full flex justify-between">
        <Link href="/" className={`relative hidden lg:block h-full w-[225px]`}>
          <Image
            src="/cypress-logo-with-text.svg"
            alt="Cypress Logo"
            fill
            loading="eager"
            className="w-full h-full !object-contain dark:invert"
          />
        </Link>
        <div className="lg:w-fit py-3 items-end  bg-white dark:bg-gray-800 dark:lg:bg-transparent lg:bg-transparent w-full  flex gap-3 lg:flex-row flex-col">
          {navListItems.map(({ label, icon, url }, key) => (
            <Link
              key={label}
              href={
                label === "About" || label === "Contact" ? (url as string) : "/"
              }
              onClick={(e) => {
                if (label !== "About" && label !== "Contact") {
                  e.preventDefault();
                }
              }}
              className={` justify-center h-fit  text-blue-gray-500 w-fit m-auto lg:m-0 `}>
              <MenuItem
                disabled={label !== "About" && label !== "Contact"}
                className="flex lg:py-[0.30rem]  justify-center items-center gap-2 lg:rounded-full dark:hover:bg-gray-900">
                {/* {React.createElement(icon, { className: "h-[18px] w-[18px]" })} */}
                <li
                  className={`${
                    label === "Contact" || label === "About"
                      ? "text-gray-900 dark:text-gray-200"
                      : "text-gray-500 dark:text-gray-400"
                  } flex gap-2 font-bold uppercase text-sm box-content`}>
                  {label}
                  {/* {label === "Cart" && (
                    <span className="rounded-full m-0 py-0 leading-tight h-fit border border-gray-400 px-1">
                      0
                    </span>
                  )} */}
                </li>
              </MenuItem>
            </Link>
          ))}
          <div className="flex gap-3 lg:py-[0.45rem]  items-center lg:mx-0 mx-auto">
            <SunIcon
              opacity={state.darkMode ? "0.5" : "1"}
              className="h-5 w-5 text-black dark:text-white"
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
              className="h-5 w-5 text-black dark:text-white"
            />
          </div>
        </div>
      </div>
    </ul>
  );
}

export function Navigation() {
  const [isLoaded, setIsLoaded] = React.useState(false);
  const [isNavOpen, setIsNavOpen] = React.useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const toggleIsNavOpen = () => setIsNavOpen((cur) => !cur);

  React.useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 960) setIsNavOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    isLoaded && (
      <Navbar
        shadow={false}
        fullWidth={true}
        className={`  h-[90px] z-[10000] relative items-center lg:flex w-full rounded-none border-b border-t-0 border-l-0 border-r-0 border-white  drop-shadow-md  max-w-none dark:!bg-gray-800 !bg-white py-4 p-0`}>
        <a
          href="/"
          className={`z-[1000]  lg:hidden h-full max-w-[200px] absolute left-0 right-0 flex m-auto top-0 bottom-0`}>
          <Image
            src="/cypress-logo-with-text.svg"
            alt="Cypress Logo"
            fill
            className="w-full h-full object-contain dark:invert"
          />
        </a>
        <div className="relative my-auto w-full mx-auto  h-full max-w-none flex items-center justify-between text-blue-gray-900">
          <div className="hidden  w-full lg:flex">
            <NavList isNavOpen={isNavOpen} />
          </div>
          <div className="w-full max-w-full  flex justify-end">
            <IconButton
              size="sm"
              variant="text"
              onClick={toggleIsNavOpen}
              className="ml-auto mr-4 lg:hidden max-w-none">
              <Bars2Icon className="h-6 w-6 text-black dark:text-white" />
            </IconButton>
          </div>

          {/* <Button size="sm" variant="text">
          <span>Log In</span>
        </Button>
        <ProfileMenu /> */}
        </div>
        <Collapse open={isNavOpen} className="h-fit  z-[10000]">
          <NavList isNavOpen={isNavOpen} />
        </Collapse>
      </Navbar>
    )
  );
}
