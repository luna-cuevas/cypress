import Image from "next/image";
import React from "react";

type Props = {};

const page = (props: Props) => {
  return (
    <div className="flex w-full  h-[calc(100vh-80px)] mt-12 lg:mt-0 px-[5%] lg:px-0">
      <div className="m-auto flex h-full justify-between w-full max-w-5xl gap-10 lg:flex-row flex-col">
        <div className="relative lg:w-1/2 m-auto order-2 w-full h-1/2 lg:h-3/4">
          <Image
            src="/about-image.jpg"
            alt="Picture of the author"
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1024px) 100vw, 100vw"
            className="h-full w-full object-cover object-center"
          />
        </div>
        <div className="lg:w-1/2 lg:h-3/4 m-auto dark:text-white p-4 gap-6 flex flex-col lg:order-2">
          <h1 className="text-4xl text-center">Lorem Ipsum</h1>
          <p className="text-lg leading-relaxed">
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the industry's standard dummy text
            ever since the 1500s, when an unknown printer took a galley of type
            and scrambled it to make a type specimen book. It has survived not
            only five centuries, but also the leap into electronic typesetting,
            remaining essentially unchanged. It was popularised in the 1960s
            with the release of Letraset sheets containing Lorem Ipsum passages,
            and more recently with desktop publishing software like Aldus
            PageMaker including versions of Lorem Ipsum.
          </p>
        </div>
      </div>
    </div>
  );
};

export default page;
