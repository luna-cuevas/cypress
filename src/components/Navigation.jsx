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
import Link from "next/link";
import { globalStateAtom } from "@/context/atoms";
import { useAtom } from "jotai";

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
    label: "Inbox",
    icon: InboxArrowDownIcon,
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

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <Menu open={isMenuOpen} handler={setIsMenuOpen} placement="bottom-end">
      <MenuHandler>
        <Button
          variant="text"
          color="blue-gray"
          className="flex items-center gap-1 rounded-full py-0.5 pr-2 pl-0.5 lg:ml-auto">
          <Avatar
            variant="circular"
            size="sm"
            alt="tania andrew"
            className="border border-gray-900 p-0.5"
            src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1480&q=80"
          />
          <ChevronDownIcon
            strokeWidth={2.5}
            className={`h-3 w-3 transition-transform ${
              isMenuOpen ? "rotate-180" : ""
            }`}
          />
        </Button>
      </MenuHandler>
      <MenuList className="p-1">
        {profileMenuItems.map(({ label, icon }, key) => {
          const isLastItem = key === profileMenuItems.length - 1;
          return (
            <MenuItem
              key={label}
              onClick={closeMenu}
              className={`flex items-center gap-2 rounded ${
                isLastItem
                  ? "hover:bg-red-500/10 focus:bg-red-500/10 active:bg-red-500/10"
                  : ""
              }`}>
              {React.createElement(icon, {
                className: `h-4 w-4 ${isLastItem ? "text-red-500" : ""}`,
                strokeWidth: 2,
              })}
              <Typography
                as="span"
                variant="small"
                className="font-normal"
                color={isLastItem ? "red" : "inherit"}>
                {label}
              </Typography>
            </MenuItem>
          );
        })}
      </MenuList>
    </Menu>
  );
}

// nav list menu
const navListMenuItems = [
  {
    title: "@material-tailwind/html",
    description:
      "Learn how to use @material-tailwind/html, packed with rich components and widgets.",
  },
  {
    title: "@material-tailwind/react",
    description:
      "Learn how to use @material-tailwind/react, packed with rich components for React.",
  },
  {
    title: "Material Tailwind PRO",
    description:
      "A complete set of UI Elements for building faster websites in less time.",
  },
];

function NavListMenu() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const renderItems = navListMenuItems.map(({ title, description }) => (
    <a href="#" key={title}>
      <MenuItem>
        <Typography variant="h6" color="blue-gray" className="mb-1">
          {title}
        </Typography>
        <Typography variant="small" color="gray" className="font-normal">
          {description}
        </Typography>
      </MenuItem>
    </a>
  ));

  return (
    <React.Fragment>
      <Menu allowHover open={isMenuOpen} handler={setIsMenuOpen}>
        <MenuHandler>
          <Typography as="a" href="#" variant="small" className="font-normal">
            <MenuItem className="hidden items-center gap-2 font-medium text-blue-gray-900 lg:flex lg:rounded-full">
              <Square3Stack3DIcon className="h-[18px] w-[18px] text-blue-gray-500" />{" "}
              Pages{" "}
              <ChevronDownIcon
                strokeWidth={2}
                className={`h-3 w-3 transition-transform ${
                  isMenuOpen ? "rotate-180" : ""
                }`}
              />
            </MenuItem>
          </Typography>
        </MenuHandler>
        <MenuList className="hidden w-[36rem] grid-cols-7 gap-3 overflow-visible lg:grid">
          <Card
            color="blue"
            shadow={false}
            variant="gradient"
            className="col-span-3 grid h-full w-full place-items-center rounded-md">
            <RocketLaunchIcon strokeWidth={1} className="h-28 w-28" />
          </Card>
          <ul className="col-span-4 flex w-full flex-col gap-1">
            {renderItems}
          </ul>
        </MenuList>
      </Menu>
      <MenuItem className="flex items-center gap-2 font-medium text-blue-gray-900 lg:hidden">
        <Square3Stack3DIcon className="h-[18px] w-[18px] text-blue-gray-500" />{" "}
        Pages{" "}
      </MenuItem>
      <ul className="ml-6 flex w-full flex-col gap-1 lg:hidden">
        {renderItems}
      </ul>
    </React.Fragment>
  );
}

// nav list component
const navListItems = [
  {
    label: "Home",
    icon: CubeTransparentIcon,
    url: "/",
  },
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
    label: "Account",
    icon: CodeBracketSquareIcon,
    url: "/account",
  },
  {
    label: "Cart",
    icon: Square3Stack3DIcon,
  },
];

function NavList({ isNavOpen }) {
  const [state, setState] = useAtom(globalStateAtom);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", state.darkMode);
  }, [state.darkMode]);

  return (
    <ul className="mt-2 mb-4 flex w-full justify-evenly flex-col gap-2 lg:mb-0 lg:mt-0 lg:flex-row lg:items-center">
      {/* <NavListMenu /> */}
      {navListItems.slice(0, 3).map(({ label, icon, url }, key) => (
        <Typography
          disabled={label == "Shop"}
          key={label}
          as={label == "Shop" ? "li" : "a"}
          href={url}
          variant="h5"
          color="gray"
          className="font-medium text-blue-gray-500 w-fit m-auto lg:m-0">
          <MenuItem
            disabled={label === "Shop"}
            className="flex items-center gap-2 lg:rounded-full">
            {/* {React.createElement(icon, { className: "h-[18px] w-[18px]" })}{" "} */}
            <li
              className={`${
                label !== "Shop" ? "text-gray-900" : "text-gray-400"
              }`}>
              {label}
            </li>
          </MenuItem>
        </Typography>
      ))}
      <div className={`relative hidden lg:block`}>
        <Image
          src="/cypress-logo.svg"
          alt="tania andrew"
          width={80}
          height={80}
          className="rounded-full"
        />
      </div>

      {navListItems.slice(3).map(({ label, icon, url }, key) => (
        <Typography
          disabled={label !== "About"}
          key={label}
          as={label == "About" ? "a" : "li"}
          href={url}
          variant="h5"
          color="gray"
          className="font-medium text-blue-gray-500 w-fit m-auto lg:m-0">
          <MenuItem
            disabled={true}
            className="flex items-center gap-2 lg:rounded-full">
            {/* {React.createElement(icon, { className: "h-[18px] w-[18px]" })}{" "} */}
            <li
              className={`flex gap-2 ${
                label == "About" ? "text-gray-900" : "text-gray-400"
              }`}>
              {" "}
              {label}
              {label == "Cart" && (
                <p className=" rounded-full border border-gray-400 px-1"> 0</p>
              )}
            </li>
          </MenuItem>
        </Typography>
      ))}
      <div className="flex gap-4 items-center lg:mx-0 mx-auto">
        <SunIcon
          color="black"
          opacity={state.darkMode ? "0.5" : "1"}
          className="h-6 w-6 "
        />
        <Switch
          id="dark-mode"
          name="dark-mode"
          checked={state.darkMode}
          onChange={(event) => {
            setState({ ...state, darkMode: event.target.checked });
          }}
        />
        <MoonIcon
          color="black"
          opacity={state.darkMode ? "1" : "0.5"}
          className="h-5 w-5"
        />
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
        className="rounded-none border-b-2 dark:border-b-0 border-gray-200 drop-shadow-md dark:drop-shadow-none max-w-none w-full !bg-white py-4 lg:p-0">
        <div className="relative mx-auto flex items-center justify-between text-blue-gray-900">
          {/* <Typography
          as="a"
          href="#"
          className="mr-4 ml-2 cursor-pointer py-1.5 font-medium">
          Material Tailwind
        </Typography> */}
          <div className="hidden  w-full lg:flex">
            <NavList isNavOpen={isNavOpen} />
          </div>
          <IconButton
            size="sm"
            color="blue-gray"
            variant="text"
            onClick={toggleIsNavOpen}
            className="ml-auto mr-2 lg:hidden">
            <Bars2Icon className="h-6 w-6" />
          </IconButton>

          {/* <Button size="sm" variant="text">
          <span>Log In</span>
        </Button>
        <ProfileMenu /> */}
        </div>
        <Collapse open={isNavOpen} className="overflow-scroll">
          <NavList />
        </Collapse>
      </Navbar>
    )
  );
}
