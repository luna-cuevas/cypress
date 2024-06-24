"use client";
import React, { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { MenuItem, Switch, Typography } from "@material-tailwind/react";
import { SunIcon, MoonIcon } from "@heroicons/react/24/solid";
import { globalStateAtom } from "@/context/atoms";
import { useAtom } from "jotai";
import { usePathname } from "next/navigation";
import ProfileMenu from "./ProfileMenu";
import NavItem from "./NavItem";

const shopCategories = [
  {
    title: "Pants",
    url: "/shop/pants",
  },
  {
    title: "Shirts",
    url: "/shop/shirts",
  },
  {
    title: "New Arrivals",
    url: "/shop/new-arrivals",
  },
  {
    title: "Featured",
    url: "/shop/featured",
  },
  {
    title: "Accessories",
    url: "/shop/accessories",
  },
  {
    title: "Sale",
    url: "/shop/sale",
  },
];

const navListItems = [
  {
    label: "Shop",
    isDropdown: true,
    shopCategories,
  },
  {
    label: "About",
    url: "/about",
  },
  {
    label: "Contact",
    url: "/contact",
  },
  {
    label: "Cart",
    url: "/cart",
  },
];

const NavList = ({
  isNavOpen,
  products,
}: {
  isNavOpen?: boolean;
  products?: any[];
}) => {
  const [state, setState] = useAtom(globalStateAtom);
  const path = usePathname();

  useEffect(() => {
    document.documentElement.classList.toggle("dark", state.darkMode);
  }, [state.darkMode]);

  return (
    <ul className="!z-[10000000] relative border-t border-gray-200 lg:border-t-0 flex max-w-screen lg:w-screen lg:h-[70px] justify-between flex-col gap-2 lg:flex-row lg:items-center">
      <div className="lg:w-[80%] z-[1000000] w-full mx-auto mt-auto h-full flex justify-between">
        <Link href="/" className="relative hidden lg:block w-[250px]">
          <Image
            src="/cypress-logo-with-text.svg"
            alt="Cypress Logo"
            fill
            loading="eager"
            className={`${
              path == "/" ? "invert" : "invert-0"
            } w-full h-full !object-contain dark:invert group-hover:invert-0 dark:group-hover:invert pt-2`}
          />
        </Link>
        <div className="lg:w-fit !z-[3000000] items-end py-6 lg:py-0 bg-white dark:bg-cypress-green dark:lg:bg-transparent lg:bg-transparent w-full flex gap-2 lg:flex-row flex-col">
          {navListItems.map(({ label, url, isDropdown }, key) => (
            <NavItem
              products={products}
              key={key}
              label={label}
              url={url}
              isCart={label === "Cart"}
              isDropdown={isDropdown}
              shopCategories={shopCategories}
              state={state}
              setState={setState}></NavItem>
          ))}
          <div className="flex gap-3 lg:py-[0.45rem] items-center lg:mx-0 mx-auto">
            <SunIcon
              opacity={state.darkMode ? "0.5" : "1"}
              className={`${
                path == "/" ? "text-white" : "text-black"
              } h-5 w-5 group-hover:text-black dark:text-white dark:group-hover:text-white`}
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
                path == "/" ? "text-white" : "text-black"
              } h-5 w-5 group-hover:text-black dark:text-white dark:group-hover:text-white`}
            />
          </div>
          <ProfileMenu />
        </div>
      </div>
    </ul>
  );
};

export default NavList;
