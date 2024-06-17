import ImgWithSkeleton from "@/components/ImgWithSkeleton";
import Image from "next/image";
import React from "react";

type Props = {};

const page = (props: Props) => {
  return (
    <div className="flex w-full h-screen lg:h-[calc(100vh-80px)] mt-12 lg:mt-0 px-[5%] lg:px-0">
      <div className="m-auto flex h-full justify-center w-full lg:flex-row flex-col gap-4 lg:gap-0">
        <div className="relative z-0  xl:w-[40%] 2xl:w-[35%] justify-end my-auto order-2 w-[80%] lg:w-[45%]  m-auto lg:mx-0 h-full md:h-[80%] xl:h-[90%] ">
          <ImgWithSkeleton
            src="/about-image.jpg"
            alt="About us"
            styles="rounded-lg"
          />
          {/* <Image
            src="/about-image.jpg"
            alt="Picture of the author"
            fill
            priority
            blurDataURL=""
            sizes="(max-width: 768px) 50vw, (max-width: 1024px) 50vw, 50vw"
            className="h-full opacity-90 rounded-lg w-full object-cover object-right-top"
          /> */}
          <div
            className="absolute inset-0 z-0  "
            style={{
              backgroundSize: "100% 100%",
              backgroundPosition: "100% 100%",
            }}></div>{" "}
        </div>
        <div className="lg:w-1/2 lg:h-3/4 my-auto dark:text-white p-4  flex flex-col lg:order-2">
          <div className="mx-auto lg:w-[100%] xl:w-[80%] gap-6 flex flex-col">
            <h1 className="text-4xl text-center uppercase">Who we are</h1>
            <p className="lg:text-lg leading-relaxed text-base">
              Cypress is a multi-brand space championing thoughtful elegance in
              the Dallas menswear scene. Inspired by the beauty of the natural
              world, we aim to curate a moment in time defined by calm and
              creativity. Our selections revolve around craftsmanship and
              experimentation, constructing a playground for self-expression.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
