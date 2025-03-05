"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import NavList from "./NavList";
import DropDownButton from "./DropDownButton";
import { usePathname } from "next/navigation";

type Props = {
  products?: any[];
};

export const Navigation = (props: Props) => {
  const pathName = usePathname();

  return (
    <nav
      className={`${
        pathName == "/"
          ? "absolute grid grid-cols-3 grid-flow-col z-20"
          : "border-b hover:bg-white dark:hover:bg-gray-900/50 group flex relative"
      }  overflow-hidden top-0 left-0 right-0 h-auto box-content  lg:px-[2%] backdrop-blur-[1px] justify-between transition-background-color duration-1000 items-center rounded-none dark:hover:bg-gray-900/50 bg-transparent dark:bg-black dark:border-gray-800 lg:py-2 p-0`}>
      <span className="col-span-1"></span>
      <div
        className={`${
          pathName == "/" ? "" : "lg:ml-0"
        } w-fit justify-center flex m-auto`}>
        <Link
          href="/"
          className="h-[50px] w-[150px] lg:w-[200px] relative left-0 right-0 flex m-auto top-0 bottom-0">
          <Image
            src="/cypress-text-logo.svg"
            alt="Cypress Logo"
            fill
            className={` w-full h-full !object-contain group-hover:invert-0 dark:invert dark:group-hover:invert pt-2`}
          />
        </Link>
      </div>

      {pathName === "/" ? (
        <div className="flex items-center gap-4 justify-end">
          <NavList homePageNav={true} />
          <div className="w-fit flex justify-end">
            <DropDownButton />
          </div>
        </div>
      ) : (
        <>
          <div className="my-auto hidden w-fit h-full lg:flex items-center justify-between text-blue-gray-900">
            <NavList homePageNav={false} />
          </div>
          <div className="w-fit absolute right-4 top-2 flex justify-end">
            <DropDownButton />
          </div>
        </>
      )}
    </nav>
  );
};
