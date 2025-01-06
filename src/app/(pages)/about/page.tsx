import ImgWithSkeleton from "@/components/common/ImgWithSkeleton";
import React from "react";

const page = () => {
  return (
    <section className="relative min-h-[calc(100vh-90px)] py-32 lg:py-40">
      <div className="relative max-w-[1920px] mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-start max-w-7xl mx-auto">
          <div className="order-2 lg:order-1 h-[60vh] lg:h-[75vh] relative">
            <ImgWithSkeleton
              src="/about-image.jpg"
              alt="About us"
              styles="object-cover object-right-top w-full h-full grayscale hover:grayscale-0 transition-all duration-1000"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
          </div>

          <div className="order-1 lg:order-2 flex flex-col gap-12 text-black dark:text-white">
            <div className="space-y-8">
              <h1 className="!font-['arpona'] text-3xl md:text-4xl lg:text-5xl font-extralight tracking-wide">
                Who We Are
              </h1>
              <p className="!font-['arpona'] text-lg lg:text-xl font-light tracking-wide leading-relaxed">
                Cypress is a multi-brand space championing thoughtful elegance
                in the Dallas menswear scene. Inspired by the beauty of the
                natural world, we aim to curate a moment in time defined by calm
                and creativity. Our selections revolve around craftsmanship and
                experimentation, constructing a playground for self-expression.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default page;
