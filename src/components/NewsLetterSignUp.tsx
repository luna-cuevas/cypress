"use client";
import React, { useEffect, useState } from "react";
import { TracedLogo } from "./TracedLogo";
import { motion } from "framer-motion";
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
  const [state, setState] = useAtom(globalStateAtom);

  useEffect(() => {
    if (signUpStatus.status === "error") {
      setTimeout(() => {
        setSignUpStatus({ message: "", status: "" });
      }, 3000);
    }
  }, [signUpStatus]);

  const splitText = (text: string) => {
    return text.split("").map((char: string, index: number) => ({
      char,
      key: `${char}-${index}`,
    }));
  };

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
    <div className="flex py-8 lg:p-0 box-content  flex-col dark:bg-gray-900 opacity-80 sticky h-fit  lg:h-[calc(100vh-90px)] w-full  justify-center text-center">
      <div className="flex-col px-[5%] md:px-0 max-w-[450px] h-2/3 gap-3 mx-auto flex dark:text-white">
        {textData.map((textItem, textIndex) => (
          <motion.g key={textIndex}>
            {splitText(textItem.text).map((char, charIndex) => (
              <motion.text
                key={char.key}
                fill={textItem.fill}
                textAnchor="middle"
                className="text-4xl"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{
                  delay: charIndex * 0.15 + 4,
                  duration: 0.15,
                  ease: "easeInOut",
                }}>
                {char.char}
              </motion.text>
            ))}
          </motion.g>
        ))}
        <div className="w-full max-w-[300px] mx-auto">
          <TracedLogo
            duration={2}
            delay={3.5}
            noLineLeadIn={true}
            color={state.darkMode ? "#fff" : "#000"}
          />
        </div>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            delay: 0.15 + 4,
            duration: 1,
            ease: "easeInOut",
          }}
          className="text-xl leading-relaxed">
          Subscribe to our newsletter to keep up to date with our progress and
          receive exclusive offers!
        </motion.p>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            delay: 0.15 + 5,
            duration: 1,
            ease: "easeInOut",
          }}
          className="w-full mx-auto">
          {signUpStatus.status === "" ? (
            <form
              onSubmit={(e) => {
                onSubmit(e);
              }}
              className="flex flex-col gap-4">
              <input
                className="border-2 font-bold text-black rounded-md placeholder:text-gray-600 p-2 focus-visible:outline-none w-full border-black dark:border-white bg-transparent border-t-0 border-r-0 border-l-0 dark:text-white"
                name="email"
                type="email"
                placeholder="Email"
                id="email"
              />
              <button
                className="dark:bg-white transition-all duration-100 hover:scale-105 dark:hover:bg-gray-300 bg-gray-500 text-black font-bold rounded-md p-2 hover:bg-gray-600 focus-visible:outline-none"
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
        </motion.div>
      </div>
    </div>
  );
};

export default NewsLetterSignUp;
