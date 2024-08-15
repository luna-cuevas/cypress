"use client";
import { globalStateAtom } from "@/context/atoms";
import { handleSubscribe } from "@/utils/handleNewsLetterSignUp";
import { Motion } from "@/utils/Motion";
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
    <Motion
      type="footer"
      initial={{
        opacity: 0,
        y: 40,
      }}
      whileInView={{
        opacity: 1,
        y: 0,
      }}
      exit={{
        opacity: 0,
        y: 40,
      }}
      transition={{ duration: 0.5 }}
      className=" w-full dark:text-white grid grid-cols-2 md:grid-cols-4  border-y border-gray-600 dark:border-white">
      <div className="border-r border-b md:border-b-0 border-gray-400 dark:border-white flex flex-col gap-4 lg:p-8 p-4">
        <h1 className="text-xl font-bold  decoration-1 underline-offset-4">
          Newsletter
        </h1>
        {signUpStatus.status === "" ? (
          <form
            onSubmit={(e) => {
              onSubmit(e);
            }}
            className="flex  gap-4 flex-col 3xl:flex-row">
            <input
              className="border-2 font-bold text-black rounded-md dark:placeholder:text-white p-2 focus-visible:outline-none 3xl:w-2/3 border-black dark:border-white bg-transparent border-t-0 border-r-0 border-l-0 dark:text-white"
              name="email"
              type="email"
              placeholder="Email"
              id="email"
            />
            <button
              className=" dark:text-white transition-all duration-100 hover:scale-105 dark:hover:bg-gray-300 bg-transparent border-gray-200 border-2 text-black font-bold rounded-md p-2 hover:bg-gray-200 focus-visible:outline-none"
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
      <div className="border-b md:border-b-0 md:border-r border-gray-400 dark:border-white flex flex-col gap-4 lg:p-8 p-4">
        <h1 className="text-xl font-bold  decoration-1 underline-offset-4">
          Shop
        </h1>
        <ul className="grid lg:grid-cols-3 grid-cols-2 gap-y-2 ">
          {shopCategories.map(({ title, url }) => (
            <li className="text-sm" key={title}>
              <Link href={url} className="inline-block text-left ">
                {" "}
                {title}
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <div className=" border-r border-gray-400 dark:border-white flex flex-col gap-4 lg:p-8 p-4">
        <h1 className="text-xl font-bold  decoration-1 underline-offset-4">
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
                  className="inline-block text-left ">
                  {" "}
                  {item}
                </Link>
              </li>
            )
          )}
        </ul>
      </div>
      <div className=" flex flex-col gap-4 lg:p-8 p-4">
        <h1 className="text-xl font-bold  decoration-1 underline-offset-4">
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
    </Motion>
  );
};

export default Footer;
