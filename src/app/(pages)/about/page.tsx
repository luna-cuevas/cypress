import ImgWithSkeleton from "@/components/ImgWithSkeleton";
import Image from "next/image";
import React from "react";

type Props = {};

const page = (props: Props) => {
  return (
    <div className="flex w-full h-screen  lg:min-h-[calc(100vh-80px)]  lg:mt-0 px-[5%] lg:px-0">
      <div className="m-auto flex h-full justify-center mx-auto w-full py-12 max-w-7xl lg:flex-row flex-col gap-4 lg:gap-0">
        <div className="relative z-0 mt-6 lg:mt-auto  justify-end my-auto order-2 w-[80%] lg:w-1/2  m-auto lg:mx-0 h-full md:h-[80%] xl:h-[90%] ">
          <ImgWithSkeleton
            src="/about-image.jpg"
            alt="About us"
            styles="rounded-lg object-cover object-right-top w-full h-full grayscale filter"
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
        <div className="lg:w-1/2 lg:h-[80%]  my-auto dark:text-white px-4  flex flex-col lg:order-2">
          <div className="mx-auto w-full gap-6 pl-4 flex flex-col">
            <h1 className="text-4xl lg:text-left text-center uppercase">
              Who we are
            </h1>
            <p className="lg:text-lg leading-relaxed text-center lg:text-left text-base">
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
