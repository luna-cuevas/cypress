"use client";
import { useRef, useState } from "react";
import { DeviceTabletIcon, StarIcon } from "@heroicons/react/20/solid";
import { Radio, RadioGroup } from "@headlessui/react";
import Link from "next/link";
import { useAtom } from "jotai";
import { globalStateAtom } from "@/context/atoms";
import Image from "next/image";
import { usePathname } from "next/navigation";

function classNames(...classes: any[]) {
  return classes.filter(Boolean).join(" ");
}

export default function ProductDetails({ product }: { product: any }) {
  const reviews = { href: "#", average: 4, totalCount: 117 };

  const paths = usePathname();
  const pathSegments = paths.split("/").filter(Boolean);

  const [state, setState] = useAtom(globalStateAtom);
  const [selectedVariant, setSelectedVariant] = useState<any | null>(
    product.variants[0]
  );

  const imageRefs = useRef<HTMLDivElement[]>([]);

  const selectVariant = (variant: object | string) => {
    console.log("variant", variant);
    setSelectedVariant(variant);
  };

  const handleAddToCart = () => {
    if (!selectedVariant) return; // Prevent adding to cart if no variant is selected

    console.log("selectedProduct", product);
    console.log("selectedVariant", selectedVariant);

    // Check if the item with the exact variant already exists in the cart
    const existingItemIndex = state.cartItems.findIndex(
      (item: any) =>
        item.product.id === product.id &&
        item.variant.variantId === selectedVariant.variantId
    );

    if (existingItemIndex !== -1) {
      // The exact product variant exists, update its quantity
      const updatedCartItems = [...state.cartItems];
      updatedCartItems[existingItemIndex] = {
        ...updatedCartItems[existingItemIndex],
        quantity: updatedCartItems[existingItemIndex].quantity + 1,
      };

      setState({
        ...state,
        cartItems: updatedCartItems,
      });
    } else {
      // The exact product variant does not exist, add a new item
      setState({
        ...state,
        cartItems: [
          ...state.cartItems,
          {
            quantity: 1,
            handle: product.handle,
            product: product,
            variant: selectedVariant,
          },
        ],
      });
    }
  };

  const scrollToImage = (index: number) => {
    imageRefs.current[index].scrollIntoView({
      behavior: "smooth",
      block: "nearest",
    });
  };

  return (
    <div className="bg-white ">
      <div className="py-6 ">
        <nav
          aria-label="Breadcrumb"
          className="py-2 pl-2 border-b lg:w-full border-y border-gray-200">
          <ol role="list" className="flex max-w-2xl items-center space-x-1">
            <li className="flex items-center">
              <Link
                href={`/`}
                className="font-medium text-xs text-gray-500 hover:text-gray-600">
                Home
              </Link>
            </li>
            {pathSegments.map((segment, index) => {
              const href = "/" + pathSegments.slice(0, index + 1).join("/");
              const isLast = index === pathSegments.length - 1;

              return (
                <li key={segment} className="flex items-center">
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
                        : "font-medium text-xs text-gray-500 hover:text-gray-600"
                    }>
                    {segment}
                  </Link>
                </li>
              );
            })}
          </ol>
        </nav>
        <div className="w-full h-full flex lg:flex-row flex-col lg:px-[10%] mx-auto">
          {/* Image gallery */}
          <div className="mt-6 h-full max-h-[50vh] lg:max-h-none overflow-scroll  lg:w-1/2 flex">
            <div className="w-[50px] overflow-y-scroll space-y-2 hidden lg:block">
              {product.images.map((image: any, index: number) => (
                <div
                  key={index}
                  ref={(el) => (imageRefs.current[index] = el!)}
                  className="relative w-full h-[50px] cursor-pointer"
                  onClick={() => scrollToImage(index)}>
                  <Image
                    fill
                    priority
                    quality={100}
                    sizes="(max-width: 640px) 75vw,(min-width: 1024px) 100vw, 33vw"
                    blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mO8fPFiCwAH7wL7Pf/IOAAAAABJRU5ErkJggg=="
                    placeholder="blur"
                    src={image.src}
                    alt={image.altText}
                    className="h-full w-full object-cover object-center"
                  />
                </div>
              ))}
            </div>
            <div className="flex-col flex w-full h-full">
              {product.images.map((image: any, index: number) => (
                <div key={index} className={`relative w-full h-[500px]`}>
                  <Image
                    fill
                    priority
                    quality={100}
                    sizes="(max-width: 640px) 75vw,(min-width: 1024px) 100vw, 33vw"
                    blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mO8fPFiCwAH7wL7Pf/IOAAAAABJRU5ErkJggg=="
                    placeholder="blur"
                    src={image.src}
                    alt={image.altText}
                    className="h-full w-full object-cover object-center"
                  />
                </div>
              ))}
            </div>
          </div>
          <div className="!relative block h-auto lg:w-1/2 px-10">
            {/* Product info */}
            <div className="m-auto lg:sticky right-0 top-0 pt-10 left-0 max-w-2xl px-4  ">
              <div className="lg:col-span-2 mb-4  lg:border-gray-200 lg:pr-8">
                <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-2xl">
                  {product.title}
                </h1>
              </div>

              {/* Options */}
              <div className="mt-4 lg:row-span-3 lg:mt-0">
                <h2 className="sr-only">Product information</h2>
                <p className="text-3xl tracking-tight text-gray-900">
                  ${selectedVariant.variantPrice}
                </p>

                {/* Reviews */}
                {/* <div className="mt-6">
              <h3 className="sr-only">Reviews</h3>
              <div className="flex items-center">
                <div className="flex items-center">
                  {[0, 1, 2, 3, 4].map((rating) => (
                    <StarIcon
                      key={rating}
                      className={classNames(
                        reviews.average > rating
                          ? "text-gray-900"
                          : "text-gray-200",
                        "h-5 w-5 flex-shrink-0"
                      )}
                      aria-hidden="true"
                    />
                  ))}
                </div>
                <p className="sr-only">{reviews.average} out of 5 stars</p>
                <a
                  href={reviews.href}
                  className="ml-3 text-sm font-medium text-indigo-600 hover:text-indigo-500">
                  {reviews.totalCount} reviews
                </a>
              </div>
            </div> */}

                <div className="mt-10">
                  {/* Sizes */}
                  <div className="mt-10">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium text-gray-900">
                        Size
                      </h3>
                      <a
                        href="#"
                        className="text-sm font-medium text-gray-800 hover:text-cypress-green-light">
                        Size guide
                      </a>
                    </div>

                    <fieldset aria-label="Choose a size" className="mt-4">
                      <RadioGroup
                        value={selectedVariant}
                        className="grid grid-cols-4 gap-4 sm:grid-cols-8 lg:grid-cols-4">
                        {product.variants.map(
                          (variant: {
                            name: string;
                            variantQuantityAvailable: number;
                            variantTitle: string;
                          }) => (
                            <Radio
                              key={variant.name}
                              value={variant}
                              onClick={() => selectVariant(variant)}
                              disabled={variant.variantQuantityAvailable === 0}
                              className={({ focus }) =>
                                classNames(
                                  variant.variantQuantityAvailable
                                    ? "cursor-pointer bg-white text-gray-900 shadow-sm"
                                    : "cursor-not-allowed bg-gray-50 text-gray-200",
                                  focus ? "ring-2 ring-indigo-500" : "",
                                  "group relative flex items-center justify-center rounded-md border px-2 py-2 text-sm font-medium uppercase hover:bg-gray-50 focus:outline-none sm:flex-1 "
                                )
                              }>
                              {({ checked, focus }) => (
                                <>
                                  <span>{variant.variantTitle}</span>
                                  {variant.variantQuantityAvailable > 0 ? (
                                    <span
                                      className={classNames(
                                        checked
                                          ? "border-cypress-green"
                                          : "border-transparent",
                                        focus ? "border" : "border-2",
                                        "pointer-events-none absolute -inset-px rounded-md"
                                      )}
                                      aria-hidden="true"
                                    />
                                  ) : (
                                    <span
                                      aria-hidden="true"
                                      className="pointer-events-none absolute -inset-px rounded-md border-2 border-gray-200">
                                      <svg
                                        className="absolute inset-0 h-full w-full stroke-2 text-gray-200"
                                        viewBox="0 0 100 100"
                                        preserveAspectRatio="none"
                                        stroke="currentColor">
                                        <line
                                          x1={0}
                                          y1={100}
                                          x2={100}
                                          y2={0}
                                          vectorEffect="non-scaling-stroke"
                                        />
                                      </svg>
                                    </span>
                                  )}
                                </>
                              )}
                            </Radio>
                          )
                        )}
                      </RadioGroup>
                    </fieldset>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      handleAddToCart();
                    }}
                    className="mt-10 flex w-full items-center justify-center rounded-md border border-transparent bg-cypress-green px-8 py-3 text-base font-medium text-white hover:bg-cypress-green-light focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                    Add to bag
                  </button>
                </div>
              </div>

              <div className="py-10 lg:col-span-2 lg:col-start-1  lg:border-gray-200 lg:pb-16 lg:pr-8 lg:pt-6">
                {/* Description and details */}
                <div>
                  <h3 className="sr-only">Description</h3>

                  <div className="space-y-6">
                    <p className="text-base text-gray-900">
                      {product.description}
                    </p>
                  </div>
                </div>

                <div className="mt-10">
                  <h3 className="text-sm font-medium text-gray-900">
                    Highlights
                  </h3>

                  <div className="mt-4">
                    <ul
                      role="list"
                      className="list-disc space-y-2 pl-4 text-sm">
                      {/* {product.highlights.map((highlight: any, index: number) => (
                    <li key={index} className="text-gray-400">
                      <span className="text-gray-600">{highlight}</span>
                    </li>
                  ))} */}
                    </ul>
                  </div>
                </div>

                <div className="mt-10">
                  <h2 className="text-sm font-medium text-gray-900">Details</h2>

                  <div className="mt-4 space-y-6">
                    <p className="text-sm text-gray-600">{product.details}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
