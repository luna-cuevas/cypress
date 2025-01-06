"use client";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import LoadingScreen from "./LoadingScreen";

type Props = {};

const PageTransition = (props: Props) => {
  const [isLoading, setIsLoading] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    // When the pathname changes, briefly show loading
    setIsLoading(true);

    // Mock a small delay or rely on react transitions if needed.
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [pathname]);

  if (isLoading) {
    return <LoadingScreen />;
  }
};

export default PageTransition;
