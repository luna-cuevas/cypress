"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { logoPaths } from "../../data/HalfLogoPaths";
import { useAtom } from "jotai";
import { globalStateAtom } from "@/context/atoms";

type Props = {
  duration?: number;
  strokeWidth?: number;
  color: string;
  classes?: string;
  delay?: number;
};

export const TracedHalfLogo = (props: Props) => {
  const [state, setState] = useAtom(globalStateAtom);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);
  return (
    isLoaded && (
      <motion.svg
        className={props.classes || ""}
        version="1.1"
        id="Layer_1"
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        x="0px"
        y="0px"
        width="100%"
        height="100%"
        viewBox="0 0 123 220"
        enableBackground="new 0 0 123 220"
        xmlSpace="preserve">
        {logoPaths.map((path, id) => {
          return (
            <motion.path
              key={id}
              fill="#ffffff8f"
              fillRule="evenodd"
              stroke={props.color}
              strokeWidth={props.strokeWidth || 0.5}
              d={path.path}
              initial={{
                columnFill: "balance",
                pathLength: 0,
                fillOpacity: 0,
                strokeOpacity: 0,
              }}
              animate={{
                pathLength: 1,
                fillOpacity: 1,
                strokeOpacity: 1,
              }}
              transition={{
                duration: 6,
                easings: "easeInOut",
                ease: "linear",
                infinite: true,
                repeat: Infinity,
                repeatType: "reverse",
                // delay: path.id * 0.5,
              }}
            />
          );
        })}
      </motion.svg>
    )
  );
};
