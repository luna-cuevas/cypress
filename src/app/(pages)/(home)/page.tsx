import NewsLetterSignUp from "@/components/NewsLetterSignUp";
import { shopifyClient } from "../../../lib/shopify";
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
import Link from "next/link";
import HeroTitle from "@/components/HeroTitle";
import { productQuery } from "@/utils/productQuery";
import { fetchFeatured } from "@/utils/fetchFeatured";

export default async function Home({ params }: { params: any }) {
  const response = await fetch(`${process.env.BASE_URL}/api/fetchProducts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
    },
    body: JSON.stringify({ productQuery: fetchFeatured() }),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  console.log("product data", data);

  if (!data) {
    return console.error("No data returned from fetchProducts");
  }
  const products = data.products;

  const heroImages = [
    "https://cdn.shopify.com/s/files/1/0693/0749/8727/files/hero-img-1.webp?v=1719512582&width=800&height=800format=webp&quality=100&scale=1",
    "https://cdn.shopify.com/s/files/1/0693/0749/8727/files/hero-img-2.webp?v=1719512818&width=800&height=800format=webp&quality=100&scale=1",
    "https://cdn.shopify.com/s/files/1/0693/0749/8727/files/hero-img-3.webp?v=1719512582&width=800&height=800format=webp&quality=100&scale=1",
    "https://cdn.shopify.com/s/files/1/0693/0749/8727/files/hero-img-4.webp?v=1719512862&width=800&height=800format=webp&quality=100&scale=1",
  ];

  return (
    <main className="flex flex-col relative justify-center overflow-x-hidden  min-h-[calc(100vh-70px)]">
      {/* Hero Section */}
      <div className="w-screen h-screen bg-black absolute top-0">
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
      <section className="w-full h-screen  bg-opacity-50 bg-black  z-0 flex items-center justify-start">
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
      {/* 
      <section className="w-screen relative h-fit py-[25px] z-50 flex ">
        <SlideCarousel products={products} />
      </section> */}

      <section className="w-full flex  h-[100vh] md:h-[120vmax] xl:h-[100vmax] transition-all duration-500  mt-[25px]  mx-auto">
        <Gallery products={products} />
      </section>

      <section className="w-full flex gap-4 border-y-2 py-2 my-4 border-cypress-green dark:border-cypress-green-light">
        <TickerCategories />
      </section>

      <section className="bg-white dark:bg-gray-900">
        <div className="gap-16 items-center py-8 px-4 mx-auto max-w-[1400px] lg:grid lg:grid-cols-2 lg:py-8 lg:px-6">
          <div className="font-light text-gray-500 sm:text-lg dark:text-gray-400">
            <h2 className="mb-4 text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white">
              We didn't reinvent the wheel
            </h2>
            <p className="mb-4">
              We are strategists, designers and developers. Innovators and
              problem solvers. Small enough to be simple and quick, but big
              enough to deliver the scope you want at the pace you need. Small
              enough to be simple and quick, but big enough to deliver the scope
              you want at the pace you need.
            </p>
            <p>
              We are strategists, designers and developers. Innovators and
              problem solvers. Small enough to be simple and quick.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-8">
            <img
              className="w-full rounded-lg"
              src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/content/office-long-2.png"
              alt="office content 1"
            />
            <img
              className="mt-4 w-full lg:mt-10 rounded-lg"
              src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/content/office-long-1.png"
              alt="office content 2"
            />
          </div>
        </div>
      </section>

      {/* <LoadingSkeleton /> */}
      <NewsLetterSignUp />
    </main>
  );
}
