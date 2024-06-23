import NewsLetterSignUp from "@/components/NewsLetterSignUp";
import { shopifyClient } from "../../lib/shopify";
import { useEffect } from "react";
import { LoadingSkeleton } from "@/components/LoadingSkeleton";
import Image from "next/image";
import SlideCarousel from "@/components/SlideCarousel";
import TickerCategories from "@/components/TickerCategories";
import Gallery from "@/components/Gallery";
import FadeCarousel from "@/components/FadeCarousel";
import { TracedHalfLogo } from "@/components/TracedHalfLogo";
import { useAtom } from "jotai";
import { globalStateAtom } from "@/context/atoms";
import fetchProducts from "@/app/utils/fetchProducts";
import Link from "next/link";
import HeroTitle from "@/components/HeroTitle";

export default async function Home() {
  const products = await fetchProducts();

  console.log("products", products);

  const heroImages = [
    "/hero-images/hero-img-1.webp",
    "/hero-images/hero-img-2.webp",
    "/hero-images/hero-img-3.webp",
    "/hero-images/hero-img-4.webp",
  ];

  return (
    <main className="flex flex-col relative justify-center overflow-x-hidden  min-h-[calc(100vh-70px)]">
      {/* Hero Section */}
      <div className="w-screen h-screen  absolute top-0">
        {/* <TracedHalfLogo
          color="white"
          classes="md:w-1/2 w-[65%] z-50 absolute h-full object-contain -top-[15%] md:-top-[10%] -right-[20%] z-10"
        />
        <TracedHalfLogo
          color="white"
          classes="md:w-1/2 w-[65%] z-50 hidden md:block absolute h-full -rotate-[10deg] object-contain  top-[30%] md:top-1/3 -left-[20%] z-10 scale-x-[-1]"
        /> */}
        <FadeCarousel images={heroImages} />
      </div>
      <section className="w-full h-screen  bg-opacity-50 bg-black  z-20 flex items-center justify-start">
        <div className="text-center h-[50px]  w-full">
          <div className="flex mx-auto w-full md:w-fit text-center md:text-left relative">
            <HeroTitle />
          </div>
          <Link href="/shop">
            <button className="bg-cypress-green font-bold hover:bg-cypress-green-light text-white px-4 py-2 mt-4 rounded-lg">
              Shop Now
            </button>
          </Link>
        </div>
      </section>

      <section className="w-screen relative h-fit py-[25px] z-50 flex ">
        <SlideCarousel products={products} />
      </section>

      <section className="w-full flex gap-4 border-y-2 py-2 border-cypress-green dark:border-cypress-green-light">
        <TickerCategories />
      </section>

      <section className="w-full flex  h-[100vh] md:h-[100vmax] xl:h-[85vmax] transition-all duration-500  mt-[25px]  mx-auto">
        <Gallery products={products} />
      </section>

      {/* <LoadingSkeleton /> */}
      {/* <NewsLetterSignUp /> */}
    </main>
  );
}
