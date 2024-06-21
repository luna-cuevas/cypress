import NewsLetterSignUp from "@/components/NewsLetterSignUp";
import { shopifyClient } from "../../lib/shopify";
import { useEffect } from "react";
import { LoadingSkeleton } from "@/components/LoadingSkeleton";
import Image from "next/image";
import SlideCarousel from "@/components/SlideCarousel";
import TickerCategories from "@/components/TickerCategories";

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

  return (
    <main className="flex flex-col relative justify-center  min-h-[calc(100vh-70px)]">
      {/* Hero Section */}
      <div className="w-screen h-[calc(100vh-70px)] absolute top-0">
        <Image
          priority
          sizes="
                (max-width: 640px) 100vw,
                (max-width: 1024px) 50vw,
                33vw
                "
          blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mO8fPFiCwAH7wL7Pf/IOAAAAABJRU5ErkJggg=="
          placeholder="blur"
          src="/hero-img.jpg"
          objectFit="cover"
          objectPosition="center"
          alt="Cypress"
          fill
          className="w-full h-full z-0"
        />
      </div>
      <section className="w-full h-[calc(100vh-70px)]  bg-white bg-opacity-15 z-50 flex items-center justify-start">
        <div className="text-center max-w-sm  lg:max-w-lg w-full">
          <h1 className="text-4xl sm:text-4xl font-bold">
            Shop the latest in men's fashion
          </h1>
          <button className="bg-black text-white px-4 py-2 mt-4 rounded-lg">
            Shop Now
          </button>
        </div>
      </section>

      <section className="w-screen relative h-fit py-[25px] bg-white bg-opacity-15 z-50 flex ">
        <SlideCarousel products={products.products} />
      </section>

      <section className="w-full flex gap-4">
        <TickerCategories />
      </section>

      {/* <LoadingSkeleton /> */}
      {/* <NewsLetterSignUp /> */}
    </main>
  );
}
