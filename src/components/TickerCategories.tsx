"use client";
import React from "react";
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
    <div className="overflow-hidden whitespace-nowrap">
      <div className="ticker-container inline-block">
        {[...categories, ...categories].map((item, index) => (
          <div
            key={index}
            className="inline-block  justify-center text-center px-2 mx-5 md:mx-16">
            <Link
              href={`/shop/${item?.toLowerCase() || "default"}`}
              className={`${trajanRegular.className} text-black dark:text-white text-lg w-full font-bold text-center uppercase underline`}>
              {item}
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TickerCategories;
