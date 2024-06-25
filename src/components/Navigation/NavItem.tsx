"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Typography,
  Collapse,
  Accordion,
  AccordionHeader,
  AccordionBody,
} from "@material-tailwind/react";
import { ChevronDownIcon, Square3Stack3DIcon } from "@heroicons/react/24/solid";
import { usePathname } from "next/navigation";
import { trajanLight, trajanRegular } from "@/lib/fonts";
import Image from "next/image";

const NavItem = ({
  label,
  url,
  isCart,
  isDropdown,
  state,
  setState,
  shopCategories,
  products,
}: {
  label: string;
  url?: string;
  isCart?: boolean;
  isDropdown?: boolean;
  state: any;
  setState: any;
  shopCategories?: { title: string; url: string }[];
  products?: any[];
}) => {
  const path = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isShopMenuOpen, setIsShopMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 960) {
        setIsMobile(true);
      } else {
        setIsMobile(false);
        setIsMenuOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleCartClick = () => {
    setState({ ...state, cartOpen: true });
  };

  const handleMenuToggle = () => {
    setIsMenuOpen((prev) => !prev);
    console.log("isMenuOpen", isMenuOpen);
  };

  return isCart ? (
    <div className="justify-center h-fit text-blue-gray-500 w-full m-auto lg:m-0">
      <MenuItem
        onClick={handleCartClick}
        className="flex px-2 lg:py-[0.35rem] rounded-none group/menuItem hover:bg-opacity-80 focus:bg-cypress-green-light active:bg-cypress-green-light hover:bg-cypress-green-light justify-center items-center gap-2">
        <li
          className={`${
            path == "/" ? "lg:text-white text-black" : "text-black"
          } underline-animation relative flex gap-2 font-bold uppercase text-sm box-content dark:text-white group-hover:text-black dark:group-hover:text-white`}>
          {label}
          {label === "Cart" && (
            <span
              className={`${
                path == "/" ? "border-white" : "border-black"
              } rounded-full m-0 dark:border-white py-0 leading-tight h-fit border group-hover:border-black dark:group-hover:border-white group-hover/menuItem:border-black px-1`}>
              {state.cartItems.length}
            </span>
          )}
        </li>
      </MenuItem>
    </div>
  ) : isDropdown ? (
    <div className="z-[1000000] w-full">
      <Menu
        allowHover={isMobile ? false : true}
        open={isMenuOpen}
        handler={setIsMenuOpen}>
        <MenuHandler className="hidden lg:inline-block px-2 lg:py-[0.35rem] rounded-none hover:bg-opacity-80 focus:bg-cypress-green-light active:bg-cypress-green-light hover:bg-cypress-green-light">
          <MenuItem className="flex px-2   !lg:pb-[0.35rem] rounded-none  justify-center items-center gap-2">
            <li
              className={`${
                path == "/" ? "lg:text-white text-black" : "text-black"
              }  relative justify-center group-hover:text-black dark:group-hover:text-white dark:text-gray-200 flex gap-2 font-bold uppercase text-sm box-content`}>
              {label}
              <ChevronDownIcon
                strokeWidth={2}
                className={`h-3 w-3 transition-transform ${
                  isMenuOpen ? "rotate-180" : ""
                }`}
              />
            </li>
          </MenuItem>
        </MenuHandler>
        <MenuList className="hidden gap-4 lg:flex w-full px-[10%] justify-center border-none rounded-none m-0 h-fit dark:bg-cypress-green ">
          <ul className="grid grid-rows-3 focus:outline-none w-1/2 grid-cols-3 gap-2 m-4">
            {shopCategories &&
              shopCategories.map(({ title, url }) => (
                <Link href={url} key={title}>
                  <MenuItem className="flex px-2 rounded-none hover:bg-opacity-80 focus:bg-cypress-green-light active:bg-cypress-green-light  hover:bg-cypress-green-light justify-left items-center ">
                    <li
                      className={` ${trajanRegular.className} text-black underline-animation relative group-hover:text-black dark:group-hover:text-white dark:text-gray-200 flex uppercase text-sm box-content`}>
                      {title}
                    </li>
                  </MenuItem>
                </Link>
              ))}
          </ul>
          <Link
            className="cursor-pointer"
            href={products ? `/shop/${products[0].handle}` : "/products"}>
            <div className="relative w-[180px] h-[180px]">
              <Image
                src={products ? products[0].images[0].src : "/cypress-logo.svg"}
                alt="Cypress Logo"
                fill
                className="object-cover"
              />
            </div>
          </Link>
        </MenuList>

        <Accordion
          className="lg:hidden w-full  justify-center items-center gap-2"
          open={isShopMenuOpen}
          animate={{
            unmount: {
              height: "0px",
            },
          }}>
          <AccordionHeader
            className="hover:bg-opacity-80 focus:bg-cypress-green-light active:bg-cypress-green-light hover:bg-cypress-green-light mx-auto w-full py-[0.35rem] lg:hidden flex justify-center flex-grow px-2 ml-2 border-none"
            onClick={() => setIsShopMenuOpen(!isShopMenuOpen)}>
            <li
              className={`${
                path == "/" ? "lg:text-white text-black" : "text-black"
              }  relative group-hover:text-black dark:group-hover:text-white dark:text-gray-200 flex gap-2 font-bold uppercase text-sm box-content`}>
              {label}
              <ChevronDownIcon
                strokeWidth={2}
                className={`h-3 w-3 transition-transform ${
                  isMenuOpen ? "rotate-180" : ""
                }`}
              />
            </li>
          </AccordionHeader>
          <AccordionBody className="w-full">
            <ul
              className={`lg:hidden grid sm:grid-cols-3 grid-cols-2 border-b-2 border-gray-400  w-full gap-2 px-auto my-4 `}>
              {shopCategories &&
                shopCategories.map(({ title, url }) => (
                  <MenuItem className="flex px-2 rounded-none hover:bg-opacity-80  active:bg-cypress-green-light focus:bg-cypress-green-light hover:bg-cypress-green-light justify-center lg:justify-left items-center ">
                    <Link href={url} key={title}>
                      <li
                        className={`${
                          path == "/"
                            ? "lg:text-white text-black"
                            : "text-black"
                        } ${
                          trajanRegular.className
                        } underline-animation relative group-hover:text-black dark:group-hover:text-white dark:text-gray-200 flex uppercase text-sm box-content`}>
                        {title}
                      </li>
                    </Link>
                  </MenuItem>
                ))}
            </ul>
          </AccordionBody>
        </Accordion>
      </Menu>
    </div>
  ) : (
    <Link
      key={label}
      href={url || "/"}
      className="justify-center h-fit w-full m-auto lg:m-0">
      <MenuItem className="flex px-2 lg:py-[0.35rem] rounded-none hover:bg-opacity-80 focus:bg-cypress-green-light active:bg-cypress-green-light hover:bg-cypress-green-light justify-center items-center gap-2">
        <li
          className={`${
            path == "/" ? "lg:text-white text-black" : "text-black"
          } underline-animation relative group-hover:text-black dark:group-hover:text-white dark:text-gray-200 flex gap-2 font-bold uppercase text-sm box-content`}>
          {label}
        </li>
      </MenuItem>
    </Link>
  );
};

export default NavItem;
