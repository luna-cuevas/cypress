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

const NavList = (collections: any) => {
  const [state, setState] = useAtom(globalStateAtom);
  const path = usePathname();

  useEffect(() => {
    document.documentElement.classList.toggle("dark", state.darkMode);
  }, [state.darkMode]);

  return (
    <ul className="  relative border-t border-gray-200 lg:border-t-0 flex   justify-between flex-col gap-2 lg:flex-row lg:items-center">
      <div className="  w-full mx-auto mt-auto h-full flex justify-between">
        <Motion
          type="div"
          initial={{
            x: 100,
            opacity: 0,
          }}
          whileInView={{
            x: 0,
            opacity: 1,
          }}
          exit={{
            x: 100,
            opacity: 0,
          }}
          transition={{
            duration: 0.5,
          }}
          className="lg:w-fit ju  items-end py-3 lg:py-0 bg-white dark:bg-cypress-green dark:lg:bg-transparent lg:bg-transparent w-full flex gap-2 lg:flex-row flex-col">
          {navListItems.map(({ label, url, icon }, key) => (
            <NavItem
              key={key}
              label={label}
              url={url}
              isCart={label === "Cart"}
              // isDropdown={isDropdown}
              shopCategories={shopCategories}
              state={state}
              icon={icon}
              setState={setState}></NavItem>
          ))}
          <ProfileMenu />
        </Motion>
      </div>
    </ul>
  );
};

export default NavList;
