"use client";
import { globalStateAtom } from "@/context/atoms";
import { handleSubscribe } from "@/utils/handleNewsLetterSignUp";
import { useAtom } from "jotai";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

type Props = {};

const Footer = (props: Props) => {
  const [signUpStatus, setSignUpStatus] = useState({
    message: "",
    status: "",
  });
  const [state, setState] = useAtom(globalStateAtom);

  useEffect(() => {
    if (signUpStatus.status === "error") {
      setTimeout(() => {
        setSignUpStatus({ message: "", status: "" });
      }, 3000);
    }
  }, [signUpStatus]);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const email = (e.currentTarget.email as HTMLInputElement).value;
    const response = await handleSubscribe(e);

    if (response.status === "error") {
      setSignUpStatus({
        message: response.message,
        status: "error",
      });
      toast.error(response.message);
    } else {
      setSignUpStatus({
        message: response.message,
        status: "success",
      });
      toast.success(response.message);
    }
  };

  return (
    <div className="mt-6 w-full dark:text-white bg-white dark:bg-gray-800 grid grid-cols-2 md:grid-cols-4  border-y border-gray-900 dark:border-white">
      <div className="border-r border-b md:border-b-0 border-gray-900 dark:border-white flex flex-col gap-4 lg:p-8 p-4">
        <h1 className="text-xl font-bold underline decoration-1 underline-offset-4">
          Newsletter
        </h1>
        {signUpStatus.status === "" ? (
          <form
            onSubmit={(e) => {
              onSubmit(e);
            }}
            className="flex  gap-4 flex-col 2xl:flex-row">
            <input
              className="border-2 font-bold text-black rounded-md placeholder:text-gray-600 p-2 focus-visible:outline-none 2xl:w-2/3 border-black dark:border-white bg-transparent border-t-0 border-r-0 border-l-0 dark:text-white"
              name="email"
              type="email"
              placeholder="Email"
              id="email"
            />
            <button
              className="dark:bg-white transition-all duration-100 hover:scale-105 dark:hover:bg-gray-300 bg-gray-300 text-black font-bold rounded-md p-2 hover:bg-gray-600 focus-visible:outline-none"
              type="submit">
              Sign up
            </button>
          </form>
        ) : (
          <p
            className={`text-${
              signUpStatus.status === "success" ? "green" : "red"
            }-500 text-xl`}>
            {signUpStatus.message}
          </p>
        )}
      </div>
      <div className="border-b md:border-b-0 md:border-r border-gray-900 dark:border-white flex flex-col gap-4 lg:p-8 p-4">
        <h1 className="text-xl font-bold underline decoration-1 underline-offset-4">
          Shop
        </h1>
        <ul className="grid lg:grid-cols-3 grid-cols-2 gap-y-2 ">
          {["All", "New", "Jackets", "Pants", "Shirts", "Tees"].map((item) => (
            <li className="text-sm" key={item}>
              <Link
                onClick={(e) => {
                  e.preventDefault();
                }}
                aria-disabled="true"
                href={`/shop/${item.toLowerCase().replace(" ", "-")}`}
                className="underline-animation relative inline-block text-left before:absolute before:inset-0 before:bg-transparent before:transition-all hover:before:bg-transparent">
                {" "}
                {item}
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <div className=" border-r border-gray-900 dark:border-white flex flex-col gap-4 lg:p-8 p-4">
        <h1 className="text-xl font-bold underline decoration-1 underline-offset-4">
          Info
        </h1>
        <ul className="grid lg:grid-cols-2 grid-cols-1 gap-y-2">
          {["Our Story", "Contact", "Terms of Service", "Privacy Policy"].map(
            (item) => (
              <li className="text-sm" key={item}>
                <Link
                  onClick={(e) => {
                    if (item !== "Our Story" && item !== "Contact") {
                      e.preventDefault();
                    }
                  }}
                  aria-disabled="true"
                  href={`/${
                    item == "Our Story"
                      ? "about"
                      : item.toLowerCase().replace(" ", "-")
                  }`}
                  className="underline-animation relative inline-block text-left before:absolute before:inset-0 before:bg-transparent before:transition-all hover:before:bg-transparent">
                  {" "}
                  {item}
                </Link>
              </li>
            )
          )}
        </ul>
      </div>
      <div className=" flex flex-col gap-4 lg:p-8 p-4">
        <h1 className="text-xl font-bold underline decoration-1 underline-offset-4">
          Socials
        </h1>
        <div className="flex gap-2">
          <Link href="https://www.instagram.com">
            <Image
              className="dark:invert"
              src="/socials-logos/instagram.svg"
              alt="Instagram"
              width={24}
              height={24}
            />
          </Link>
          <Link href="https://www.instagram.com">
            <Image
              className="dark:invert"
              src="/socials-logos/facebook.svg"
              alt="Instagram"
              width={24}
              height={24}
            />
          </Link>
          <Link href="https://www.instagram.com">
            <Image
              className="dark:invert"
              src="/socials-logos/twitter.svg"
              alt="Instagram"
              width={24}
              height={24}
            />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Footer;
