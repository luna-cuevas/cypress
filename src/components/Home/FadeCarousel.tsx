"use client";
import Image from "next/image";
import React, { useState, useEffect } from "react";

type Props = {
  images: string[];
};

const FadeCarousel: React.FC<Props> = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 9000);

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
            quality={100}
            sizes="(max-width: 640px) 100vw,(min-width: 1024px) 100vw, 100vw"
            blurDataURL="data:image/png;base64,L57-1h},?HxVETNdR.R*9vJC9tI="
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
