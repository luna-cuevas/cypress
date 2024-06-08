import Image from "next/image";
import React from "react";

type Props = {};

const page = (props: Props) => {
  return (
    <div className="flex w-full  h-[calc(100vh-80px)] mt-12 lg:mt-0 px-[5%] lg:px-0">
      <div className="m-auto flex h-full justify-between w-full  gap-10 lg:flex-row flex-col">
        <div className="relative z-0 lg:w-1/2 m-auto order-2 w-full h-[80%] ">
          <Image
            src="/about-image.jpg"
            alt="Picture of the author"
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1024px) 100vw, 100vw"
            className="h-full w-full object-cover object-center scale-x-[-1]"
          />
          <div
            className="absolute inset-0 z-0  "
            style={{
              backgroundSize: "100% 100%",
              backgroundPosition: "100% 100%",
            }}></div>{" "}
        </div>
        <div className="lg:w-1/2 lg:h-3/4 m-auto dark:text-white p-4 gap-6 flex flex-col lg:order-2">
          <h1 className="text-4xl text-center">Who we are</h1>
          <p className="text-lg leading-relaxed">
            Cypress is a multi-brand space championing thoughtful elegance in
            the Dallas menswear scene. Inspired by the beauty of the natural
            world, we aim to curate a moment in time defined by calm and
            creativity. Our selections revolve around craftsmanship and
            experimentation, constructing a playground for self-expression.
          </p>
        </div>
      </div>
    </div>
  );
};

export default page;
