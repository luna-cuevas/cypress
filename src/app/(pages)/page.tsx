import NewsLetterSignUp from "@/components/NewsLetterSignUp";
import { shopifyClient } from "../../lib/shopify";
import { useEffect } from "react";
import { LoadingSkeleton } from "@/components/LoadingSkeleton";
import Image from "next/image";
import SlideCarousel from "@/components/SlideCarousel";
import TickerCategories from "@/components/TickerCategories";
import Gallery from "@/components/Gallery";
import FadeCarousel from "@/components/FadeCarousel";

const fetchProducts = async () => {
  const baseURL =
    process.env.NODE_ENV === "development"
      ? "http://localhost:3000"
      : "https://cypressclothiers.com";
  const response = await fetch(`${baseURL}/api/fetchProducts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      productQuery: `
        query {
          products(first: 10) {
            edges {
              node {
                id
                handle
                title
                description
                handle
                variants(first: 10) {
                  edges {
                    node {
                      id
                      title
                      quantityAvailable
                      price {
                        amount
                        currencyCode
                      }
                    }
                  }
                }
                images(first: 1) {
                  edges {
                    node {
                      src
                      altText
                    }
                  }
                }
              }
            }
          }
        }
      `,
    }),
  });
  const products = await response.json();
  return products;
};

export default async function Home() {
  const products = await fetchProducts();

  const heroImages = [
    "/hero-images/hero-img-1.jpg",
    "/hero-images/hero-img-2.jpg",
    "/hero-images/hero-img-3.jpg",
    "/hero-images/hero-img-4.jpg",
  ];

  return (
    <main className="flex flex-col relative justify-center  min-h-[calc(100vh-70px)]">
      {/* Hero Section */}
      <div className="w-screen h-[calc(100vh-70px)]  absolute top-0">
        <FadeCarousel images={heroImages} />
      </div>
      <section className="w-full h-[calc(100vh-70px)]   bg-black bg-opacity-50 z-50 flex items-center justify-start">
        <div className="text-center    w-full">
          <h1 className="text-4xl text-white sm:text-4xl font-bold">
            Shop the latest in men's fashion
          </h1>
          <button className="bg-black text-white px-4 py-2 mt-4 rounded-lg">
            Shop Now
          </button>
        </div>
      </section>

      <section className="w-screen relative h-fit py-[25px] z-50 flex ">
        <SlideCarousel products={products.products} />
      </section>

      <section className="w-full flex gap-4 border-y py-2 border-gray-800 dark:border-white">
        <TickerCategories />
      </section>

      <section className="w-full flex  h-[100vh] md:h-[100vmax] xl:h-[85vmax] transition-all duration-500  mt-[25px]  mx-auto">
        <Gallery products={products.products} />
      </section>

      {/* <LoadingSkeleton /> */}
      {/* <NewsLetterSignUp /> */}
    </main>
  );
}
