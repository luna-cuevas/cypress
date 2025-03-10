"use client";
import React, { useEffect, useState } from "react";
import { useAtom } from "jotai";
import { globalStateAtom } from "@/context/atoms";
import { toast } from "react-toastify";
import { handleSubscribe } from "@/utils/handleNewsLetterSignUp";

type Props = {};

export const textData = [
  {
    text: "Website in progress...",
    fill: "#fff",
  },
];

const NewsLetterSignUp = (props: Props) => {
  const [signUpStatus, setSignUpStatus] = useState({
    message: "",
    status: "",
  });

  useEffect(() => {
    if (signUpStatus.status === "error") {
      setTimeout(() => {
        setSignUpStatus({ message: "", status: "" });
      }, 3000);
    }
  }, [signUpStatus]);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
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
    <div className="flex pt-8 lg:p-0 box-content  mx-auto flex-col  opacity-80 sticky h-fit   w-full  justify-center text-center">
      <div className="flex-col bg-cypress-green py-8 px-[5%] w-full rounded-none  h-2/3 gap-3 mx-auto flex dark:text-white">
        <h2
          className={`!font-['trajan'] mb-4 text-3xl tracking-tight font-extrabold text-white sm:text-4xl dark:text-white`}>
          Subscribe to our newsletter
        </h2>{" "}
        <p className="mx-auto mb-4 max-w-2xl font-light text-white md:mb-8 sm:text-xl ">
          Stay up to date with the roadmap progress, announcements and exclusive
          discounts feel free to sign up with your email.
        </p>
        <div className="w-full mx-auto">
          {signUpStatus.status === "" ? (
            <form
              onSubmit={(e) => {
                onSubmit(e);
              }}
              className="flex flex-col gap-4">
              <section className="">
                <div className="py-2 px-4 mx-auto max-w-screen-xl lg:py-4 lg:px-6">
                  <div className="mx-auto max-w-screen-md sm:text-center">
                    <div className="items-center mx-auto mb-3 space-y-4 max-w-screen-sm sm:flex sm:space-y-0">
                      <div className="relative w-full">
                        <label
                          htmlFor="email"
                          className="hidden mb-2 text-sm font-medium text-white">
                          Email address
                        </label>
                        <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
                          <svg
                            className="w-5 h-5 text-gray-600 "
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg">
                            <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path>
                            <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path>
                          </svg>
                        </div>
                        <input
                          className="block p-3 pl-8  w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 sm:rounded-none sm:rounded-l-lg focus:ring-primary-500 focus:border-primary-500 "
                          placeholder="Enter your email"
                          type="email"
                          id="email"
                          name="email"
                        />
                      </div>
                      <div>
                        <button
                          type="submit"
                          className="py-3 px-5 w-full text-sm font-medium text-center text-white rounded-lg border cursor-pointer bg-primary-700 dark:bg-primary-600 border-primary-600 dark:border-primary-500 hover:bg-primary-800 dark:hover:bg-primary-700 focus:ring-4 focus:ring-primary-300 dark:focus:ring-primary-800">
                          Subscribe
                        </button>
                      </div>
                    </div>
                    <div className="mx-auto max-w-screen-sm text-sm text-left text-white">
                      <a
                        href="#"
                        className="font-medium text-blue-200 hover:underline dark:text-blue-300">
                        Read our Privacy Policy
                      </a>
                    </div>
                  </div>
                </div>
              </section>
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
      </div>
    </div>
  );
};

export default NewsLetterSignUp;
