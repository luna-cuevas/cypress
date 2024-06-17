"use client";
import React, { useState } from "react";
import Image from "next/image";

type Props = {
  src: string;
  alt: string;
  styles?: string;
};

const ImgWithSkeleton = (props: Props) => {
  const [isImageLoaded, setImageLoaded] = useState(true);
  return (
    <>
      {!isImageLoaded ? (
        <div className="flex h-full w-full place-items-center rounded-lg bg-gray-300">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="h-full w-full text-gray-400">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
            />
          </svg>
        </div>
      ) : (
        <Image
          src={props.src}
          alt={props.alt}
          fill
          priority
          // blurDataURL="data:image/jpeg;base64,/* your base64 encoded image */"
          sizes="(max-width: 768px) 50vw, (max-width: 1024px) 50vw, 50vw"
          className={`h-full w-full object-cover ${
            props.styles && props.styles
          }`}
          onLoadingComplete={() => setImageLoaded(true)}
          style={{ display: isImageLoaded ? "block" : "none" }}
        />
      )}
    </>
  );
};

export default ImgWithSkeleton;
