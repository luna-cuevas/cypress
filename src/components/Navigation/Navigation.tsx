"use client";
import React, { useState } from "react";
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
  const [isLoaded, setIsLoaded] = useState(false);

  React.useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <nav
      className={`${
        pathName == "/"
          ? "absolute grid grid-cols-3 grid-flow-col"
          : "border-b hover:bg-white dark:hover:bg-gray-900/50 group flex relative"
      }   top-0 left-0 right-0 h-fit z-50 lg:px-[2%] backdrop-blur-[1px] justify-between transition-background-color duration-1000 items-center rounded-none dark:hover:bg-gray-900/50 bg-transparent dark:bg-black dark:border-gray-800 lg:py-2 p-0`}>
      <span className="col-span-1"></span>
      <Motion
        type="div"
        initial={{ x: -50, opacity: 0 }}
        whileInView={{ x: 0, opacity: 1 }}
        exit={{ x: -50, opacity: 0 }}
        transition={{ duration: 0.5 }}
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
            className={`${
              pathName == "/" ? "invert" : "invert-0"
            } w-full h-full !object-contain group-hover:invert-0 dark:invert dark:group-hover:invert pt-2`}
          />
        </Link>
      </Motion>

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
      <NavDrawer />
    </nav>
  );
};
