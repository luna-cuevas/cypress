"use client";
import Image from "next/image";
import React, { useState, useEffect } from "react";

type Props = {
  images: string[];
};

const FadeCarousel: React.FC<Props> = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const baseUrl =
    process.env.NODE_ENV === "development"
      ? "http://localhost:3000"
      : "https://cypressclothiers.com";

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 8000); // Change image every 3 seconds

    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div className="relative w-full h-full ">
      {images.map((image, index) => (
        <div
          key={index}
          className={`absolute h-full w-full inset-0 transition-opacity duration-[2s] ${
            index === currentIndex ? "opacity-100" : "opacity-0"
          }`}>
          <Image
            src={image}
            fill
            priority
            quality={50}
            sizes="(max-width: 640px) 50vw,(min-width: 1024px) 100vw, 33vw"
            blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mO8fPFiCwAH7wL7Pf/IOAAAAABJRU5ErkJggg=="
            placeholder="blur"
            alt={`Slide ${index}`}
            className="w-full h-full object-cover"
          />
        </div>
      ))}
    </div>
  );
};

export default FadeCarousel;
