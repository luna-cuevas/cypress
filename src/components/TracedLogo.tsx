"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { logoPaths } from "../data/LogoPaths";
import { useAtom } from "jotai";
import { globalStateAtom } from "@/context/atoms";

type Props = {
  duration?: number;
  strokeWidth?: number;
  delay?: number;
  color: string;
  noLineLeadIn?: boolean;
};

export const TracedLogo = (props: Props) => {
  const [state, setState] = useAtom(globalStateAtom);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);
  return (
    isLoaded && (
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
        {logoPaths.map((path, id) => {
          if (path.id < 1 && props.noLineLeadIn) {
            return null;
          }
          return (
            <motion.path
              key={id}
              fill={props.color}
              stroke={props.color}
              strokeWidth={props.strokeWidth || 4}
              d={path.path}
              initial={{
                pathLength: 0,
                fillOpacity: 0,
                strokeWidth: 0,
                strokeOpacity: 0,
              }}
              animate={{
                pathLength: 1,
                fillOpacity: 1,
                strokeWidth: path.id < 1 ? 4 : props.strokeWidth || 4,
                strokeOpacity: 1,
              }}
              transition={{
                duration: 1,
                delay: props.delay
                  ? props.delay + path.id * 0.6
                  : path.id < 2
                  ? path.id * 0.5
                  : 1,
                ease: "linear",
                // repeat: Infinity,
                // repeatType: "reverse",
              }}
            />
          );
        })}
        {/* <motion.circle
          cx="50%" // Center x-coordinate as percentage
          cy="50%" // Center y-coordinate as percentage
          r="48%" // Radius as percentage
          fill="none"
          stroke={props.color}
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
        /> */}
      </motion.svg>
    )
  );
};
