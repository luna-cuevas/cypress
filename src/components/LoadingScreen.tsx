"use client";
import React, { useEffect, useState } from "react";
import { TracedLogo } from "./TracedLogo";

type Props = {};

const LoadingScreen = (props: Props) => {
  const [loading, setLoading] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFadeOut(true);
    }, 3300); // Start fade out after 3.5 seconds

    const hideTimer = setTimeout(() => {
      setLoading(false);
    }, 4000); // Hide after 4 seconds

    return () => {
      clearTimeout(timer);
      clearTimeout(hideTimer);
    }; // Cleanup the timers if the component unmounts
  }, []);

  return (
    <div
      className={`w-full flex bg-gray-900 h-full fixed z-50 mx-auto transition-opacity duration-1000 ${
        fadeOut ? "opacity-0" : "opacity-100"
      } ${!loading && "hidden"}`}>
      <div className="md:w-1/3  m-auto">
        <TracedLogo duration={2} strokeWidth={2} color="white" />
      </div>
    </div>
  );
};

export default LoadingScreen;
