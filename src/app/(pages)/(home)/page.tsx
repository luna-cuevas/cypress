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

      {/* <LoadingSkeleton /> */}
      {/* <NewsLetterSignUp /> */}
    </main>
  );
}
