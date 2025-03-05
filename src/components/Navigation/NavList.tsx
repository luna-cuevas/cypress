"use client";
import React, { useEffect } from "react";
import Link from "next/link";
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
        <Link
          href="https://www.instagram.com/Cypress.dtx"
          target="_blank"
          rel="noopener noreferrer"
          className="text-black dark:text-white hover:opacity-60 transition-opacity p-1 flex items-center gap-1"
          aria-label="Follow us on Instagram">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="h-4 w-4">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
          </svg>
        </Link>
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
          <div
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
            {path == "/" && (
              <Link
                href="https://www.instagram.com/cypress.dtx/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-black dark:text-white hover:opacity-60 transition-opacity p-1 flex items-center gap-1"
                aria-label="Follow us on Instagram">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="h-4 w-4">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                </svg>
              </Link>
            )}
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
          </div>
        </div>
      </li>
    </ul>
  );
};

export default NavList;
