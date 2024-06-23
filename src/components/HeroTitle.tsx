"use client";
import React, { useState, useEffect } from "react";

const titles = ["design", "quality", "style"];

const HeroTitle = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % titles.length);
    }, 2000); // Change word every 4 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full md:w-fit h-full flex gap-3 flex-col md:flex-row">
      <h1 className="text-4xl text-white sm:text-4xl font-bold">The best in</h1>
      <div className="relative text-center md:text-left overflow-hidden h-[50px]">
        {titles.map((title, index) => (
          <div
            style={{ transform: `translateY(-${currentIndex * 100}%)` }}
            key={index}
            className="transition-transform justify-center md:justify-start duration-1000 text-white md:text-left text-center font-bold text-4xl h-[48px]  flex ">
            {title}
          </div>
        ))}
      </div>
    </div>
  );
};

export default HeroTitle;
