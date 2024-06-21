"use client";
import React from "react";
import Ticker from "framer-motion-ticker";
import Link from "next/link";
import { trajanRegular } from "@/lib/fonts";

const categories = [
  "Pants",
  "Shirts",
  "New Arrivals",
  "Featured",
  "Accessories",
  "Sale",
];

type Props = {
  categories?: string[];
};

const TickerCategories: React.FC<Props> = ({}) => {
  return (
    <Ticker duration={30}>
      {categories.map((item, index) => (
        <div
          key={index}
          className="flex justify-center text-center px-2 w-fit mx-16">
          <Link
            href={`/shop/${item.toLowerCase()}`}
            className={`${trajanRegular.className} text-black dark:text-white text-lg w-full font-bold tex-center uppercase underline`}>
            {item}
          </Link>
        </div>
      ))}
    </Ticker>
  );
};

export default TickerCategories;
