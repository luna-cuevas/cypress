"use client";
import React from "react";
import { motion } from "framer-motion";
import { logoPaths } from "../data/LogoPaths";

type Props = {
  duration?: number;
  strokeWidth?: number;
  delay?: number;
};

export const TracedLogo = (props: Props) => {
  return (
    <motion.svg
      version="1.1"
      id="Layer_1"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      x="0px"
      y="0px"
      width="100%"
      height="100%"
      viewBox="0 0 1024 1024"
      enableBackground="new 0 0 1024 1024"
      xmlSpace="preserve">
      {logoPaths.map((path, index) => (
        <motion.path
          key={index}
          fill="none"
          stroke="#fff"
          strokeWidth={props.strokeWidth || 4}
          d={path.path}
          initial={{
            pathLength: 0,
            opacity: 0,
          }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{
            duration: props.duration || 2,
            delay: props.delay || 0,
            ease: "easeInOut",
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />
      ))}
      <motion.circle
        cx="50%" // Center x-coordinate as percentage
        cy="50%" // Center y-coordinate as percentage
        r="48%" // Radius as percentage
        fill="none"
        stroke="#fff"
        strokeWidth={props.strokeWidth || 4}
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{
          duration: props.duration || 2,
          delay: props.delay || 0,
          ease: "easeInOut",
          repeat: Infinity,
          repeatType: "reverse",
        }}
        className="drop-shadow-lg"
      />
    </motion.svg>
  );
};
