"use client";
import React from "react";
import { TracedLogo } from "./TracedLogo";
import { motion } from "framer-motion";

type Props = {};

export const textData = [
  {
    text: "Website in progress...",
    fill: "#fff",
  },
];

const NewsLetterSignUp = (props: Props) => {
  const splitText = (text: string) => {
    return text.split("").map((char: string, index: number) => ({
      char,
      key: `${char}-${index}`,
    }));
  };

  const handleSubscribe = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Form submitted", e.currentTarget.email.value);
  };

  return (
    <div className="flex flex-col bg-black opacity-80 fixed  h-full w-full  justify-center text-center">
      <div className="flex-col h-2/3 gap-6 mx-auto flex text-white">
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
        <div className="w-full max-w-[200px] mx-auto">
          <TracedLogo duration={4} />
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
          Subscribe to our newsletter to keep up to date <br /> with our
          progress and receive exclusive offers!
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
          <form
            onSubmit={(e) => {
              handleSubscribe(e);
            }}
            className="flex flex-col gap-4">
            <input
              className="border-2 rounded-md p-2 focus-visible:outline-none w-full border-white bg-transparent border-t-0 border-r-0 border-l-0 text-white"
              type="email"
              placeholder="Email"
              id="email"
            />
            <button
              className="bg-white text-black rounded-md p-2"
              type="submit">
              Sign up
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default NewsLetterSignUp;
