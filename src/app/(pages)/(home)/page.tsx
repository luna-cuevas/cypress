import NewsLetterSignUp from "@/components/NewsLetterSignUp";
import TickerCategories from "@/components/Home/TickerCategories";
import Gallery from "@/components/Home/Gallery";
import FadeCarousel from "@/components/Home/FadeCarousel";
import Link from "next/link";
import { arpona, trajan, trajanRegular, trajanLight } from "@/lib/fonts";
import { Motion } from "@/utils/Motion";

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
    throw new Error(`HTTP error! status: ${featuredProducts.status}`);
  }

  const featuredData = await featuredProducts.json();

  const heroImages = [
    "https://cdn.shopify.com/s/files/1/0693/0749/8727/files/hero-img-1.webp?v=1719512582&width=1600&height=1600format=webp&quality=100&scale=1",
    "https://cdn.shopify.com/s/files/1/0693/0749/8727/files/hero-img-2.webp?v=1719512818&width=1600&height=1600format=webp&quality=100&scale=1",
    "https://cdn.shopify.com/s/files/1/0693/0749/8727/files/hero-img-3.webp?v=1719512582&width=1600&height=1600format=webp&quality=100&scale=1",
    "https://cdn.shopify.com/s/files/1/0693/0749/8727/files/hero-img-4.webp?v=1719512862&width=1600&height=1600format=webp&quality=100&scale=1",
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
            className={`md:text-5xl text-4xl  ${trajanRegular.className} text-white font-bold tracking-widest leading-tight  uppercase`}>
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
              className=" col-span-2 md:col-span-1 font-bold order-1 flex md:block w-fit mx-auto md:mr-0 gap-2 text-center md:text-right">
              <h2 className={`uppercase text-xl text-white `}>
                {"Stylish men's wear "}
              </h2>
              <h3 className="uppercase text-xl text-white">
                {"Designed to last"}
              </h3>
            </Motion>{" "}
            <Link
              href="/shop"
              className="order-3 col-span-2 md:col-span-1 md:order-2">
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
              className="text-white font-bold col-span-2 md:col-span-1 flex md:block w-fit gap-2 mx-auto md:ml-0 text-center md:text-left uppercase text-xl  order-2 md:order-3 ">
              <p>{"Visit us in store  "}</p>
              <p>{"Texas, USA"}</p>
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
      {/* 
      <section className="w-screen relative h-fit py-[25px] z-50 flex ">
        <SlideCarousel products={products} />
      </section> */}

      <section
        id="featured"
        className="w-full flex  h-[100vmax] sm:h-[150vmax] md:h-[200vmax] lg:h-[80vmax] xl:h-[75vmax] transition-all duration-500  mt-4  mx-auto">
        <Gallery products={featuredData.collections} />
      </section>

      <section className="w-full flex gap-4 border-y-2 py-2 my-4 border-cypress-green dark:border-cypress-green-light">
        <TickerCategories />
      </section>

      <section className="bg-white dark:bg-gray-900">
        <div className="gap-16 items-center py-8 px-4 mx-auto max-w-[1400px] lg:grid lg:grid-cols-2 lg:py-8 lg:px-6">
          <div className="font-light text-gray-500 sm:text-lg dark:text-gray-400">
            <h2 className="mb-4 text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white">
              We didn&apos;t reinvent the wheel
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
