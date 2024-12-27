"use client";
import React, { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { MenuItem, Switch, Typography } from "@material-tailwind/react";
import {
  SunIcon,
  MoonIcon,
  EnvelopeIcon,
  BookOpenIcon,
  ShoppingBagIcon,
} from "@heroicons/react/24/solid";
import { globalStateAtom } from "@/context/atoms";
import { useAtom } from "jotai";
import { usePathname } from "next/navigation";
import ProfileMenu from "./ProfileMenu";
import NavItem from "./NavItem";
import { Motion } from "../../utils/Motion";
import { stagger } from "framer-motion";

const shopCategories = [
  {
    title: "All",
    url: "/shop",
  },
  {
    title: "Shirting",
    url: "/shop/shirts",
  },
  {
    title: "T-Shirts",
    url: "/shop/t-shirts",
  },
  {
    title: "Trousers",
    url: "/shop/pants",
  },
  {
    title: "Denim",
    url: "/shop/denim",
  },
  {
    title: "Footwear",
    url: "/shop/footwear",
  },
  {
    title: "Accessories",
    url: "/shop/accessories",
  },
];

const navListItems = [
  {
    label: "Shop",
    url: "/shop",
    icon: <ShoppingBagIcon className="h-5 w-5" />,
  },
  {
    label: "About",
    url: "/about",
    icon: <BookOpenIcon className="h-5 w-5" />,
  },
  {
    label: "Contact",
    url: "/contact",
    icon: <EnvelopeIcon className="h-5 w-5" />,
  },
  {
    label: "Cart",
    url: "/cart",
  },
];

const NavList = ({ homePageNav = false }: { homePageNav?: boolean }) => {
  const [state, setState] = useAtom(globalStateAtom);
  const path = usePathname();

  useEffect(() => {
    document.documentElement.classList.toggle("dark", state.darkMode);
  }, [state.darkMode]);

  // If on home page, only show cart and dark mode
  if (homePageNav) {
    return (
      <ul className=" items-center gap-4 hidden lg:flex">
        <NavItem
          label="Cart"
          isCart={true}
          state={state}
          icon={null}
          setState={setState}
        />
        <div className="flex gap-1 w-fit justify-center items-center">
          <button
            onClick={() => setState({ ...state, darkMode: !state.darkMode })}
            className={`text-black dark:text-white
             hover:opacity-60 transition-opacity p-1`}
            aria-label="Toggle dark mode">
            {state.darkMode ? (
              <SunIcon className="h-4 w-4" />
            ) : (
              <MoonIcon className="h-4 w-4" />
            )}
          </button>
        </div>
      </ul>
    );
  }

  return (
    <ul className="relative z-0 border-t border-gray-200 lg:border-t-0 flex justify-between flex-col gap-2 lg:flex-row lg:items-center">
      <li className="w-full">
        <div className="w-full mx-auto mt-auto h-full flex justify-between">
          <Motion
            type="div"
            animate={{
              opacity: 1,
              transition: {
                staggerChildren: 2,
                delayChildren: 2,
                staggerDirection: 1,
              },
            }}
            className={`lg:w-fit items-end py-3 lg:py-0 bg-transparent lg:bg-transparent w-full flex gap-2 ${
              path != "/" && "lg:flex-row"
            } flex-col`}>
            {navListItems.map(({ label, url, icon }, key) => {
              return (
                <NavItem
                  key={key}
                  label={label}
                  url={url}
                  isCart={label === "Cart"}
                  shopCategories={shopCategories}
                  state={state}
                  icon={icon}
                  setState={setState}
                />
              );
            })}
            <ProfileMenu />
            <div
              className={`${
                path == "/" ? "lg:hidden" : "lg:flex"
              } flex gap-1 w-fit justify-center items-center m-auto`}>
              <button
                onClick={(event) => {
                  setState({ ...state, darkMode: !state.darkMode });
                }}
                className={`text-black dark:text-white hover:opacity-60 transition-opacity p-1`}
                aria-label="Toggle dark mode">
                {state.darkMode ? (
                  <SunIcon className="h-4 w-4" />
                ) : (
                  <MoonIcon className="h-4 w-4" />
                )}
              </button>
            </div>
          </Motion>
        </div>
      </li>
    </ul>
  );
};

export default NavList;
