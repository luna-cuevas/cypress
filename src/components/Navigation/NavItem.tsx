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
  ListItem,
  ListItemPrefix,
  ListItemSuffix,
  Chip,
} from "@material-tailwind/react";
import {
  ChevronDownIcon,
  ShoppingBagIcon,
  Square3Stack3DIcon,
} from "@heroicons/react/24/solid";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { useAtom } from "jotai";
import { globalStateAtom } from "@/context/atoms";

const NavItem = ({
  label,
  url,
  isCart,
  isDropdown,
  state,
  setState,
  shopCategories,
  icon,
}: {
  label: string;
  url?: string;
  isCart?: boolean;
  isDropdown?: boolean;
  state: any;
  setState: any;
  shopCategories?: { title: string; url: string }[];
  icon: any;
}) => {
  const path = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isShopMenuOpen, setIsShopMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const totalCartItems = state.cartItems.reduce(
    (total: number, item: { quantity: number }) => {
      return total + Number(item.quantity);
    },
    0
  );

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
    setState({ ...state, cartOpen: true, showMobileMenu: false });
  };

  if (!isClient) return null;

  const hoverBackground =
    "hover:text-black text-black focus:text-black active:text-black dark:text-white dark:hover:text-white/80 dark:focus:text-white/80";

  return isCart ? (
    <div className="justify-center h-fit border-b lg:border-none border-gray-200 w-full mx-auto m-0">
      <MenuItem
        onClick={(e: React.MouseEvent<HTMLElement>) => {
          handleCartClick();
          (e.target as HTMLElement).blur();
        }}
        className="flex px-2 lg:py-[0.35rem] rounded-none group/menuItem hover:bg-transparent  focus:bg-transparent active:bg-transparent justify-start lg:justify-end items-center gap-2 transition-all duration-200 !text-black dark:!text-white">
        <ListItem
          className={`${"text-black dark:text-white hover:text-black dark:hover:text-white"} underline-animation w-fit justify-start lg:justify-end lg:gap-1 lg:p-0 relative flex hover:bg-transparent dark:active:text-white dark:focus:text-white  focus:bg-transparent focus:outline-none uppercase text-sm box-content `}>
          <ListItemPrefix className="lg:hidden">
            <ShoppingBagIcon className="h-5 w-5" />
          </ListItemPrefix>
          {label}
          {totalCartItems > 0 && (
            <span
              className={` ${"bg-black dark:bg-white text-white dark:text-black"}
            text-xs ml-2 lg:ml-0   rounded-full px-[4px] py-[0.15px] `}>
              {totalCartItems}
            </span>
          )}
        </ListItem>
      </MenuItem>
    </div>
  ) : isDropdown ? (
    <div className=" w-full border-b border-gray-200 lg:border-none">
      <Menu
        allowHover={isMobile ? false : true}
        open={isMenuOpen}
        handler={setIsMenuOpen}>
        <MenuHandler className="hidden lg:inline-block px-2 lg:py-[0.35rem] rounded-none hover:bg-opacity-60 hover:bg-cypress-green-light transition-all duration-200 focus:outline-none">
          <MenuItem className="flex px-2 !lg:pb-[0.35rem] rounded-none justify-start lg:justify-center items-center gap-2 hover:bg-transparent focus:bg-transparent active:bg-transparent transition-all duration-200">
            <li
              className={`${"text-black dark:text-white"}  relative justify-center group-hover:text-black dark:group-hover:text-white dark:text-gray-200 flex gap-2  uppercase text-sm box-content`}>
              {label}
            </li>
          </MenuItem>
        </MenuHandler>
        <MenuList className="hidden gap-4  lg:flex w-full  justify-center border-none rounded-none m-0 h-fit dark:bg-cypress-green ">
          <ul className="grid  focus:outline-none  grid-cols-4 gap-2 m-4">
            {shopCategories &&
              shopCategories.map(({ title, url }) => (
                <Link href={url} key={title}>
                  <MenuItem className="flex px-2 rounded-none hover:bg-opacity-60 justify-left items-center hover:bg-transparent focus:bg-transparent active:bg-transparent transition-all duration-200">
                    <li
                      className={`!font-['trajan'] hover:bg-transparent focus:bg-transparent active:bg-transparent text-black underline-animation relative group-hover:text-black dark:group-hover:text-white dark:text-gray-200 flex uppercase text-sm box-content`}>
                      {title}
                    </li>
                  </MenuItem>
                </Link>
              ))}
          </ul>
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
            className="hover:bg-opacity-60 focus:bg-transparent hover:bg-cypress-green-light mx-auto w-full py-[0.35rem] lg:hidden flex justify-start lg:justify-center flex-grow px-2  border-none"
            onClick={() => setIsShopMenuOpen(!isShopMenuOpen)}>
            <ListItem
              className={`${"text-black dark:text-white"}  relative w-full hover:bg-transparent focus:bg-transparent group-hover:text-black dark:group-hover:text-white dark:text-gray-200 flex   uppercase text-sm box-content`}>
              <ListItemPrefix>
                <ShoppingBagIcon className="h-5 w-5" />
              </ListItemPrefix>
              {label}
              <ListItemSuffix>
                <ChevronDownIcon
                  strokeWidth={2}
                  className={`h-3 w-3 my-auto transition-transform ${
                    isShopMenuOpen ? "rotate-180" : ""
                  }`}
                />
              </ListItemSuffix>
            </ListItem>
          </AccordionHeader>
          <AccordionBody className="w-full pt-[9px] pb-2">
            <ul
              className={`lg:hidden grid sm:grid-cols-3 grid-cols-2  w-full gap-2 px-auto my-4 `}>
              {shopCategories &&
                shopCategories.map(({ title, url }) => (
                  <MenuItem
                    key={title}
                    className="flex px-2 rounded-none hover:bg-opacity-60  hover:bg-cypress-green-light justify-left items-center hover:bg-transparent focus:bg-transparent active:bg-transparent transition-all duration-200">
                    <Link href={url}>
                      <li
                        className={`${"text-black dark:text-white"} !font-['trajan'] hover:bg-transparent focus:bg-transparent active:bg-transparent underline-animation relative group-hover:text-black dark:group-hover:text-white dark:text-gray-200 flex uppercase text-sm box-content`}>
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
      className="justify-center hover:bg-transparent focus:bg-transparent active:bg-transparent h-fit w-full mx-auto lg:m-0 border-b border-gray-200 lg:border-none">
      <MenuItem
        className={`hover:bg-transparent focus:bg-transparent active:bg-transparent flex px-2 lg:py-[0.35rem] rounded-none justify-start lg:justify-end items-center ${hoverBackground} transition-all duration-200`}>
        <ListItem
          onClick={() => {
            setState({ ...state, showMobileMenu: false });
          }}
          className={`${hoverBackground} hover:bg-transparent focus:bg-transparent active:bg-transparent focus:outline-none underline-animation w-fit lg:p-0 relative flex uppercase text-sm box-content transition-all duration-200`}>
          <ListItemPrefix className="lg:hidden underline-animation">
            {icon}
          </ListItemPrefix>
          {label}
        </ListItem>
      </MenuItem>
    </Link>
  );
};

export default NavItem;
