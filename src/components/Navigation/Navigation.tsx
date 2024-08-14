"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import NavList from "./NavList";
import DropDownButton from "./DropDownButton";
import { usePathname } from "next/navigation";
import { Motion } from "@/utils/Motion";
import { NavDrawer } from "./NavDrawer";

type Props = {
  products?: any[];
};

export const Navigation = (props: Props) => {
  const pathName = usePathname();

  return (
    <nav
      className={`${
        pathName == "/" ? "absolute z-50  " : " z-[0] "
      } h-[50px] lg:px-[10%] backdrop-blur-[1px] w-full block  justify-between transition-background-color duration-1000 group   top-0  items-center lg:flex rounded-none hover:bg-white dark:hover:bg-cypress-green bg-transparent  max-w-none dark:bg-cypress-green dark:bg-opacity-75 lg:py-4 p-0`}>
      <Motion
        type="div"
        initial={{
          y: 50,
          opacity: 0,
        }}
        animate={{
          y: 0,
          opacity: 1,
        }}
        transition={{ duration: 1 }}
        className="mx-auto lg:ml-0 w-fit justify-center flex">
        <Link
          href="/"
          className={`z-[0]  h-[50px] w-[150px] lg:w-[200px] relative left-0 right-0 flex m-auto top-0 bottom-0`}>
          <Image
            src="/cypress-text-logo.svg"
            alt="Cypress Logo"
            fill
            className={`${
              pathName == "/" ? "invert" : "invert-0"
            } w-full h-full !object-contain group-hover:invert-0  dark:invert dark:group-hover:invert pt-2`}
          />
        </Link>
      </Motion>

      <div className=" my-auto  hidden  w-fit  h-full lg:flex items-center justify-between text-blue-gray-900">
        <NavList />
      </div>
      <div className="w-fit absolute right-0  top-2 flex justify-end">
        <DropDownButton />
      </div>
      <NavDrawer />
    </nav>
  );
};
