"use client";
import React, { useEffect, useState } from "react";
import { Navbar, Collapse, IconButton } from "@material-tailwind/react";
import { Bars2Icon } from "@heroicons/react/24/solid";
import Link from "next/link";
import Image from "next/image";
import { globalStateAtom } from "@/context/atoms";
import { useAtom } from "jotai";
import { useSupabase } from "@/lib/supabase";
import { usePathname } from "next/navigation";
import { toast } from "react-toastify";
import NavList from "./NavList";

type Props = {
  products: any[];
};

export const Navigation = (props: Props) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [state, setState] = useAtom(globalStateAtom);
  const supabase = useSupabase();
  const path = usePathname();

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    const { data: authListener } =
      supabase.auth.onAuthStateChange(handleAuthChange);

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (state.cartItems.length > 0) {
      toast.success("Item added to cart");
    }
  }, [state.cartItems]);

  const handleAuthChange = async (event: any, session: any) => {
    console.log("session", session);
    if (event === "SIGNED_IN" && session !== null) {
      console.log("session", session);
      setState({ ...state, user: session.user, session, isSignInOpen: false });
    } else if (event === "SIGNED_OUT") {
      setState({ ...state, user: null, session: null, isSignInOpen: false });
      console.log("session", event);
    } else {
      console.log("session", event);
      setState({ ...state, user: null });
    }
  };

  const toggleIsNavOpen = () => setIsNavOpen((cur) => !cur);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 960) setIsNavOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    isLoaded && (
      <Navbar
        blurred={false}
        variant="filled"
        fullWidth={true}
        className={`${
          path == "/" && "absolute"
        } h-[70px]  backdrop-blur-[2px] block  transition-all duration-300 group !z-[100000000] top-0 w-screen items-center lg:flex rounded-none hover:bg-white dark:hover:bg-cypress-green bg-transparent drop-shadow-md max-w-none dark:bg-cypress-green dark:bg-opacity-75 py-4 p-0`}>
        <Link
          href="/"
          className={`z-[1000] lg:hidden h-full sm:max-w-[250px] max-w-[180px] absolute left-0 right-0 flex m-auto top-0 bottom-0`}>
          <Image
            src="/cypress-logo-with-text.svg"
            alt="Cypress Logo"
            fill
            className={`${
              path != "/" ? "invert-0" : "invert"
            } w-full h-full !object-contain group-hover:invert-0  dark:invert dark:group-hover:invert pt-2`}
          />
        </Link>
        <div className="relative my-auto w-full mx-auto h-full max-w-none flex items-center justify-between text-blue-gray-900">
          <div className="hidden w-full lg:flex">
            <NavList isNavOpen={isNavOpen} products={props.products} />
          </div>
          <div className="w-full max-w-full flex justify-end">
            <IconButton
              size="sm"
              variant="text"
              onClick={toggleIsNavOpen}
              className="ml-auto mr-4 lg:hidden max-w-none">
              <Bars2Icon
                className={`${
                  path != "/" ? "text-black" : "text-white"
                } h-6 w-6  dark:text-white group-hover:text-black dark:group-hover:text-white`}
              />
            </IconButton>
          </div>
        </div>
        <Collapse
          open={isNavOpen}
          className=" sm:w-2/3 md:w-1/2   lg:w-full justify-end ml-auto">
          <NavList isNavOpen={isNavOpen} />
        </Collapse>
      </Navbar>
    )
  );
};
