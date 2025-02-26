import React, { useState } from "react";
import { productQuery } from "@/utils/productQuery";
import Image from "next/image";
import Link from "next/link";
import Carousel from "@/components/shop/Carousel";
import AddToCartButton from "@/components/shop/AddToCartButton";
import SizeSelection from "@/components/shop/SizeSelection";
import TabContent from "@/components/shop/TabContent";
import RelatedProducts from "@/components/shop/RelatedProducts";
import { Accordions } from "@/components/shop/Accordions";
import { Motion } from "@/utils/Motion";
import { Metadata } from "next";
import NewsletterForm from "@/components/shop/NewsletterForm";
import DesktopGalleryWithLightbox from "@/components/shop/DesktopGalleryWithLightbox";

type Props = {
  params: { category: string; slug: string };
  searchParams: { variantSize?: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = params;
  try {
    const response = await fetch(`${process.env.BASE_URL}/api/fetchProducts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        productQuery: productQuery({ handle: slug }),
      }),
    });

    const data = await response.json();
    const product = data?.product;

    if (!product) {
      return {
        title: "Product Not Found",
        description: "The requested product could not be found",
      };
    }

    return {
      title: product.title,
      description: product.description || "Product details",
      openGraph: {
        title: product.title,
        description: product.description || "Product details",
        images:
          product.images?.map((image: { src: string; altText: string }) => ({
            url: image.src,
            alt: image.altText || product.title,
          })) || [],
      },
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: "Product Page",
      description: "View our product details",
    };
  }
}

// Helper function to fetch metafields
async function fetchProductMetafields(handle: string) {
  try {
    const response = await fetch(
      `${process.env.BASE_URL}/api/product-metafields?handle=${handle}&resolveReferences=true`
    );
    if (!response.ok) {
      console.error(`Failed to fetch metafields: ${response.status}`);
      return null;
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching product metafields:", error);
    return null;
  }
}

export default async function ProductPage({ params, searchParams }: Props) {
  const { slug } = params;
  const variantSize = searchParams.variantSize;
  console.log(variantSize);

  try {
    // Fetch product data
    const response = await fetch(`${process.env.BASE_URL}/api/fetchProducts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
      body: JSON.stringify({
        productQuery: productQuery({ handle: slug }),
      }),
    });

    const data = await response.json();
    const product = data?.product;

    if (!product) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[50vh] text-center p-4">
          <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
          <p className="mb-6">
            The product you&apos;re looking for could not be found.
          </p>
          <Link href="/shop" className="text-cypress-green hover:underline">
            Return to Shop
          </Link>
        </div>
      );
    }

    // Fetch metafields using our new API endpoint
    const metafieldsData = await fetchProductMetafields(slug);

    // Enhance the product object with the metafields data
    const enhancedProduct = {
      ...product,
      adminMetafields: metafieldsData?.metafields || {},
    };

    const selectedVariant = product.variants?.find(
      (variant: any) => variant.variantTitle === variantSize
    );

    const pathSegments = ["shop", params.category, slug];

    return (
      <div className="z-0 relative min-h-[calc(100vh-70px)] bg-white dark:bg-black">
        <div className="">
          <Motion
            type="div"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            viewport={{ once: false, amount: 0.15 }}
            transition={{
              duration: 0.5,
              delay: 0.1,
            }}
            className=" ">
            <nav
              aria-label="Breadcrumb"
              className="md:pt-4 md:pb-0 py-2 pl-2 lg:w-full ">
              <ol role="list" className="flex max-w-2xl items-center space-x-1">
                <li className="flex items-center">
                  <Link
                    href={`/`}
                    className="font-medium text-xs text-gray-500 dark:text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                    Home
                  </Link>
                </li>
                {pathSegments.map((segment, index) => {
                  const href = "/" + pathSegments.slice(0, index + 1).join("/");
                  const isLast = index === pathSegments.length - 1;

                  return (
                    <li key={segment} className="flex items-center capitalize">
                      <svg
                        width={16}
                        height={20}
                        viewBox="0 0 16 20"
                        fill="currentColor"
                        aria-hidden="true"
                        className="h-5 w-4 mr-0 text-gray-300">
                        <path d="M5.697 4.34L8.98 16.532h1.327L7.025 4.341H5.697z" />
                      </svg>
                      <Link
                        href={href}
                        aria-current={
                          index === pathSegments.length - 1 ? "page" : undefined
                        }
                        className={
                          isLast
                            ? "font-bold text-xs text-gray-900 dark:text-white"
                            : "font-medium text-xs text-gray-500 dark:text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                        }>
                        {segment}
                      </Link>
                    </li>
                  );
                })}
              </ol>
            </nav>

            <div className="w-full h-full flex md:flex-row flex-col max-w-[1600px] px-0 mx-auto">
              {/* Desktop Image Gallery with Lightbox */}
              <div className="hidden h-full relative gap-2 md:w-[50%] lg:w-[60%] md:flex">
                <DesktopGalleryWithLightbox images={product.images} />
              </div>

              {/* Mobile Carousel */}
              <div className="md:hidden flex h-[70vh]">
                <Carousel slides={product.images} />
              </div>

              <Motion
                type="div"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 50 }}
                viewport={{ once: false, amount: 0.15 }}
                transition={{
                  duration: 0.5,
                  delay: 0.5,
                }}
                className="relative block h-auto md:w-[50%] lg:w-[40%] pl-4 pr-4 bg-white dark:bg-black">
                {/* Product info */}
                <div className="m-auto md:sticky right-0 top-0 pt-4 left-0 max-w-2xl   ">
                  <div className="lg:col-span-2 mb-2 lg:pr-8">
                    <h1 className="text-2xl text-gray-900 dark:text-white sm:text-2xl">
                      {product.title}
                    </h1>
                    <div className="flex items-center gap-4 mt-2">
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {product.vendor}
                      </span>
                    </div>
                  </div>

                  {/* Options */}
                  <div className="mt-4 lg:row-span-3 lg:mt-0">
                    <h2 className="sr-only">Product information</h2>
                    <p className="text-xl tracking-tight text-gray-600 dark:text-gray-400">
                      $
                      {selectedVariant?.variantPrice ||
                        product.variants[0].variantPrice}
                    </p>

                    <div className="flex flex-col gap-8 my-8">
                      {/* Sizes */}
                      <div className="">
                        <div className="flex items-center justify-between">
                          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
                            {selectedVariant?.variantTitle ? (
                              <span className="gap-1 flex">
                                Size
                                <span className="text-black dark:text-white">
                                  {selectedVariant.variantTitle}
                                </span>
                              </span>
                            ) : (
                              "Select Size"
                            )}
                          </h3>
                          <Link
                            href="#"
                            className="text-sm underline font-medium text-gray-800 dark:text-gray-400 hover:text-cypress-green dark:hover:text-cypress-green-light">
                            Size guide
                          </Link>
                        </div>

                        <SizeSelection
                          selectedVariant={selectedVariant}
                          product={product}
                        />
                      </div>

                      <div className="flex gap-2 items-center">
                        <AddToCartButton
                          product={product}
                          selectedVariant={selectedVariant}
                        />
                        {/* <FavoriteButton
                          productId={product.id}
                          productTitle={product.title}
                          productImage={product.images[0]?.src || ""}
                          productPrice={
                            selectedVariant?.variantPrice ||
                            product.variants[0].variantPrice
                          }
                          productHandle={product.handle}
                        /> */}
                      </div>
                    </div>
                  </div>

                  <div className=" lg:col-span-2 lg:col-start-1 mb-4 lg:border-gray-200 ">
                    {/* Tabs */}
                    <TabContent product={product} />
                  </div>

                  <div>
                    <Accordions product={enhancedProduct} />
                  </div>
                </div>
              </Motion>
            </div>

            {/* Related Products */}
            <div className="my-12 py-8 relative border-t border-gray-200 dark:border-gray-800">
              <RelatedProducts relatedProducts={data.relatedProducts} />
            </div>

            {/* Reviews Section */}
            {/* <div className="my-12 py-8 relative border-t border-gray-200 dark:border-gray-800">
              <ProductReviews productId={product.id} />
            </div> */}

            {/* Newsletter Section */}
            <div className="my-12 py-8  relative border-t border-gray-200 dark:border-gray-800">
              <NewsletterForm />
            </div>
          </Motion>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error fetching product:", error);
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center p-4">
        <h1 className="text-2xl font-bold mb-4">Error</h1>
        <p className="mb-6">An error occurred while fetching the product.</p>
        <Link href="/shop" className="text-cypress-green hover:underline">
          Return to Shop
        </Link>
      </div>
    );
  }
}
