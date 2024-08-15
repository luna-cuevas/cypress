import NewsLetterSignUp from "@/components/NewsLetterSignUp";
import TickerCategories from "@/components/Home/TickerCategories";
import Gallery from "@/components/Home/Gallery";
import FadeCarousel from "@/components/Home/FadeCarousel";
import Link from "next/link";
import { arpona, trajan, trajanRegular, trajanLight } from "@/lib/fonts";
import { Motion } from "@/utils/Motion";
import ParallaxSection from "@/components/Home/ParallaxSection";
import { stagger } from "framer-motion";

export default async function Home({ params }: { params: any }) {
  const featuredProducts = await fetch(
    `${process.env.BASE_URL}/api/fetchCollections`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-store",
      },
    }
  );

  if (!featuredProducts.ok) {
    console.error(`HTTP error! status: ${featuredProducts.status}`);
    console.error(`HTTP error! status: ${featuredProducts.statusText}`);

    // throw new Error(`HTTP error! status: ${featuredProducts.status}`);
  }

  const featuredData = await featuredProducts.json();

  const heroImages = [
    "https://cdn.shopify.com/s/files/1/0693/0749/8727/files/hero-img-1.webp?v=1719512582&width=1600&height=1600format=webp&quality=100&scale=1",
    // "https://cdn.shopify.com/s/files/1/0693/0749/8727/files/hero-img-2.webp?v=1719512818&width=1600&height=1600format=webp&quality=100&scale=1",
    "https://cdn.shopify.com/s/files/1/0693/0749/8727/files/hero-img-3.webp?v=1719512582&width=1600&height=1600format=webp&quality=100&scale=1",
    "https://cdn.shopify.com/s/files/1/0693/0749/8727/files/hero-img-4.webp?v=1719512862&width=1600&height=1600format=webp&quality=100&scale=1",
  ];

  return (
    <main className="flex flex-col relative justify-center w-screen min-h-[calc(100vh-70px)]">
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
      <section className="w-full h-screen  bg-opacity-20 bg-black  z-0 flex items-end justify-start ">
        <div className="text-center h-fit flex flex-col gap-8 w-full  max-w-[1000px] mx-auto mb-[5%]">
          <Motion
            type="h1"
            initial={{
              y: -100,
              opacity: 0,
            }}
            whileInView={{
              y: 0,
              opacity: 1,
            }}
            exit={{
              y: -100,
              opacity: 0,
            }}
            transition={{ duration: 0.5 }}
            className={`md:text-5xl text-3xl  ${trajanRegular.className} text-white font-bold tracking-widest leading-tight  uppercase`}>
            Quality Designs
          </Motion>
          <div className="grid grid-cols-2 justify-center md:grid-cols-3  gap-4 ">
            <Motion
              type="div"
              initial={{
                x: -50,
                opacity: 0,
              }}
              whileInView={{
                x: 0,
                opacity: 1,
              }}
              exit={{
                x: -50,
                opacity: 0,
              }}
              transition={{ duration: 0.5 }}
              className=" flex-col col-span-2  md:col-span-1 font-bold order-1 flex md:block w-fit mx-auto md:mr-0 md:gap-2 text-center md:text-right">
              <h2 className={`uppercase text-xl text-white `}>
                {"Stylish men's wear "}
              </h2>
              <h3 className="uppercase text-xl text-white">
                {"Designed to last"}
              </h3>
            </Motion>{" "}
            <Link
              href="/shop"
              className="order-3 col-span-2 md:col-span-1 md:order-2 mt-6">
              <Motion
                type="button"
                initial={{
                  y: 100,
                  opacity: 0,
                }}
                whileInView={{
                  y: 0,
                  opacity: 1,
                }}
                exit={{
                  y: -100,
                  opacity: 0,
                }}
                transition={{ duration: 0.5 }}
                className="hover:bg-cypress-green hover:bg-opacity-60 font-bold bg-transparent backdrop-blur-sm border-cypress-green border-2 text-lg text-white px-6 py-3 rounded-lg">
                Shop Now
              </Motion>
            </Link>
            <Motion
              type="div"
              initial={{
                x: 50,
                opacity: 0,
              }}
              whileInView={{
                x: 0,
                opacity: 1,
              }}
              exit={{
                x: 50,
                opacity: 0,
              }}
              transition={{ duration: 0.5 }}
              className="text-white hover:underline cursor-pointer font-bold col-span-2 md:col-span-1 flex md:block w-fit gap-2 mx-auto md:ml-0 text-center md:text-left uppercase text-xl  order-2 md:order-3 ">
              <a
                target="_blank"
                href="https://maps.app.goo.gl/fmgy5j3BDaSrKZzv6">
                <p>{"Visit our store  "}</p>
                <p className="">{"Dallas, Texas"}</p>
              </a>
            </Motion>
          </div>
          <Link href="#featured" className="cursor-pointer">
            <Motion
              type="h1"
              initial={{
                y: 40,
                opacity: 0,
              }}
              animate={{
                y: 0,
                opacity: 1,
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                repeatType: "reverse",
              }}
              className={`  text-white w-fit mx-auto`}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="size-8">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m4.5 5.25 7.5 7.5 7.5-7.5m-15 6 7.5 7.5 7.5-7.5"
                />
              </svg>
            </Motion>
          </Link>
        </div>
      </section>

      <section
        id="featured"
        className="w-full flex h-[80vmax]  sm:h-[40vmax]  transition-all duration-500  mt-4  mx-auto">
        <Gallery products={featuredData.collections.slice(0, 3)} />
      </section>

      <section className="my-16 mx-auto w-fit gap-2 flex flex-col justify-center">
        <h2
          className={`${trajanRegular.className} tracking-widest text-center sm:text-left text-lg sm:text-2xl w-fit font-bold mx-auto`}>
          Crafting Elegance, Curating Excellence
        </h2>
        <p className="sm:text-xl text-center sm:text-left text-base w-fit mx-auto">
          Explore Thoughtful Menswear for the Modern Man at Cypress.
        </p>
        <div className="w-fit mx-auto">
          <Link href="/shop/shirts">
            <button className=" px-4 py-2 rounded-lg hover:decoration-gray-800 underline underline-offset-8 decoration-gray-400">
              Shop Shirting
            </button>
          </Link>
          <Link href="/shop/pants">
            <button className=" px-4 py-2 rounded-lg hover:decoration-gray-800 underline underline-offset-8 decoration-gray-400">
              Shop Trousers
            </button>
          </Link>
        </div>
      </section>

      <section
        id="featured"
        className="w-full flex h-[80vmax]  sm:h-[40vmax]  transition-all duration-500  mt-4  mx-auto">
        <Gallery products={featuredData.collections.slice(3, 6)} />
      </section>

      <section className="w-full flex gap-4 border-y-2  my-16 py-2 border-cypress-green dark:border-cypress-green-light">
        <TickerCategories />
      </section>

      <section className="bg-white mb-16">
        <div className="gap-8 items-center py-0 px-4 mx-auto  lg:grid lg:grid-cols-2 ">
          <Motion
            type="div"
            initial={{
              x: -50,
              opacity: 0,
            }}
            whileInView={{
              x: 0,
              opacity: 1,
            }}
            exit={{
              x: -50,
              opacity: 0,
            }}
            transition={{
              duration: 0.5,
            }}
            className="font-light text-left mx-auto sm:w-2/3 text-gray-800 sm:text-lg dark:text-gray-400">
            <h2
              className={`${trajanRegular.className} mb-4 text-4xl tracking-tight font-extrabold text-black dark:text-white`}>
              Who We Are
            </h2>
            <p className="mb-4">
              Cypress is a multi-brand space championing thoughtful elegance in
              the Dallas menswear scene. Inspired by the beauty of the natural
              world, we aim to curate a moment in time defined by calm and
              creativity.
            </p>
            <p>
              Our selections revolve around craftsmanship and experimentation,
              constructing a playground for self-expression.
            </p>
          </Motion>
          <Motion
            type="div"
            initial={{
              x: 50,
              opacity: 0,
            }}
            whileInView={{
              x: 0,
              opacity: 1,
            }}
            exit={{
              x: 50,
              opacity: 0,
            }}
            transition={{
              duration: 0.5,
            }}
            className="grid grid-cols-2 gap-4 mt-8 lg:mt-0">
            <img
              className="w-full rounded-lg"
              src="/about-image.jpg"
              alt="office content 1"
            />
            <img
              className="mt-4 w-full lg:mt-10 rounded-lg"
              src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/content/office-long-1.png"
              alt="office content 2"
            />
          </Motion>
        </div>
      </section>

      {/* <LoadingSkeleton /> */}

      <Motion
        type="div"
        initial={{
          scale: 0.9,
          opacity: 0,
        }}
        whileInView={{
          scale: 1,
          opacity: 1,
        }}
        exit={{
          scale: 0.9,
          opacity: 0,
        }}
        transition={{
          duration: 0.5,
        }}
        className="">
        <NewsLetterSignUp />
      </Motion>
    </main>
  );
}
