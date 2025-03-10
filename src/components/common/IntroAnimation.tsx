"use client";
import React, { useEffect, useState } from "react";
import { TracedLogo } from "../Home/TracedLogo";
import { usePathname } from "next/navigation";

type Props = {};

const IntroAnimation = (props: Props) => {
  const [loading, setLoading] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);
  const environment = process.env.NODE_ENV;
  const path = usePathname();

  useEffect(() => {
    const timer = setTimeout(() => {
      setFadeOut(true);
    }, 3500); // Start fade out after 3.5 seconds

    const hideTimer = setTimeout(() => {
      setLoading(false);
    }, 4000); // Hide after 4 seconds

    return () => {
      clearTimeout(timer);
      clearTimeout(hideTimer);
    }; // Cleanup the timers if the component unmounts
  }, []);

  if (path != "/") {
    return null;
  }

  return (
    <div
      className={`
        w-screen fixed z-[20000000000] flex bg-white h-screen   mx-auto transition-opacity duration-1000 ${
          fadeOut ? "opacity-0" : "opacity-100"
        } ${!loading && "hidden"}`}>
      <div className="h-screen w-screen  my-auto">
        <TracedLogo duration={2} strokeWidth={1} color="#535353" />
      </div>
    </div>
  );
};

export default IntroAnimation;
