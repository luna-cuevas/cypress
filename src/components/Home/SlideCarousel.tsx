"use client";
import Image from "next/image";
import React, { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAtom } from "jotai";
import { globalStateAtom } from "@/context/atoms";
import Link from "next/link";

type Props = {
  products?: {
    id: string;
    handle: string;
    productType: string;
    images: { src: string; altText: string }[];
    title: string;
    variants: any[];
  }[];
};

const SlideCarousel: React.FC<Props> = ({ products }) => {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [state, setState] = useAtom(globalStateAtom);
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<any | null>(null);

  const openBox = (product: object) => {
    setSelectedProduct(product);
    setSelectedVariant(null); // Reset selected variant when a new product is opened
  };

  const closeBox = () => {
    setSelectedProduct(null);
  };

  const selectVariant = (variant: object | string) => {
    setSelectedVariant(variant);
  };

  const handleAddToCart = () => {
    if (!selectedVariant) return; // Prevent adding to cart if no variant is selected

    // Check if the item with the exact variant already exists in the cart
    const existingItemIndex = state.cartItems.findIndex(
      (item: any) =>
        item.product.id === selectedProduct.id &&
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
            handle: selectedProduct.handle,
            product: selectedProduct,
            variant: selectedVariant,
          },
        ],
      });
    }
  };

  const onDragStart = (e: any) => {
    e.preventDefault();
  };

  return (
    <div className="w-full relative px-2 overflow-hidden ">
      <div
        ref={carouselRef}
        className="flex space-x-1 overflow-x-scroll overflow-y-hidden carousel">
        {products &&
          products.map((product) => (
            <div
              key={product.id}
              className="w-[200px] relative h-[300px] bg-gray-300 flex-shrink-0">
              <Link
                // Need to fix issue with dragging on desktop causes the link to be clicked
                onDragStart={onDragStart}
                href={`/shop/${product.productType}/${product.handle}`}>
                <Image
                  priority
                  fill
                  sizes="(max-width: 1024px) 75vw, (min-width: 1024px) 100vw, 33vw"
                  blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mO8fPFiCwAH7wL7Pf/IOAAAAABJRU5ErkJggg=="
                  placeholder="blur"
                  quality={100}
                  src={product.images[0].src}
                  alt={product.images[0].altText}
                  draggable={false}
                  className="w-full h-full object-cover cursor-pointer "
                />
              </Link>
              <button
                type="button"
                className="absolute bottom-0 text-2xl right-0 px-2 py-0 hover:bg-cypress-green bg-cypress-green-light text-white"
                onClick={() => openBox(product)}>
                +
              </button>
              <AnimatePresence>
                {selectedProduct?.id === product.id && (
                  <motion.div
                    className="absolute bottom-0 left-0 w-full bg-cypress-green bg-opacity-85 p-4 text-white z-50"
                    initial={{
                      y: "100%",
                      opacity: 0,
                    }}
                    animate={{
                      y: 0,
                      opacity: 1,
                    }}
                    transition={{
                      ease: "easeOut",
                      duration: 0.2,
                    }}
                    exit={{ y: "100%" }}>
                    <div className="relative">
                      <button
                        className="absolute -top-3 -right-3 p-1"
                        onClick={closeBox}>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke-width="1.5"
                          stroke="currentColor"
                          className="size-6">
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                          />
                        </svg>
                      </button>
                      <h2 className="text-sm font-bold">
                        {product.title.slice(0, 16)}
                      </h2>
                      <ul className="flex space-x-2 mx-auto border-y py-1 my-1 border-gray-400 flex-wrap justify-center gap-4 w-full">
                        {product.variants.length === 1 ? (
                          <button
                            type="button"
                            onClick={() => {
                              selectVariant(product.variants[0]);
                            }}
                            className={`w-fit items-center underline-animation before:absolute before:inset-0 before:bg-transparent before:transition-all hover:before:bg-transparent relative inline-block ${
                              selectedVariant === product.variants[0]
                                ? "bg-cypress-green-light text-white"
                                : ""
                            }`}>
                            <span>One Size</span>
                          </button>
                        ) : (
                          product.variants.map((variant: any) => (
                            <button
                              type="button"
                              onClick={() => {
                                selectVariant(variant);
                              }}
                              key={variant.variantId}
                              className={`w-fit px-2 items-center underline-animation before:absolute before:inset-0 before:bg-transparent before:transition-all hover:before:bg-transparent relative inline-block ${
                                selectedVariant === variant
                                  ? "bg-cypress-green-light text-white"
                                  : ""
                              }`}>
                              <span className="word-break-all">
                                {variant.variantTitle.slice(0, 10)}
                              </span>
                            </button>
                          ))
                        )}
                      </ul>
                      <p className="mx-auto w-fit">
                        {product.variants[0].variantPrice}{" "}
                      </p>
                      <button
                        className={`mt-2 w-full text-sm px-1 py-1 bg-white text-black rounded ${
                          !selectedVariant
                            ? "opacity-50 cursor-not-allowed"
                            : "opacity-100 cursor-pointer"
                        }`}
                        onClick={() => {
                          handleAddToCart();
                        }}
                        disabled={!selectedVariant}>
                        Add to Cart
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
      </div>
    </div>
  );
};

export default SlideCarousel;
