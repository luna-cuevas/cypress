"use client";
import React from "react";
import Link from "next/link";

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
              className={`!font-['trajan'] text-black dark:text-white text-lg w-full font-medium text-center `}>
              {item}
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TickerCategories;
