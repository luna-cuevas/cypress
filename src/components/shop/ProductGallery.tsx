"use client";
import { globalStateAtom } from "@/context/atoms";
import { motion, AnimatePresence } from "framer-motion";
import { useAtom } from "jotai";
import Image from "next/image";
import Link from "next/link";
import React from "react";

type Props = {
  products: {
    id: string;
    handle: string;
    productType: string;
    images: { src: string; altText: string }[];
    title: string;
    variants: any[];
  }[];
};

const ProductGallery = (props: Props) => {
  const products = props.products || [];
  const [selectedProduct, setSelectedProduct] = React.useState<any | null>(
    null
  );
  const [selectedVariant, setSelectedVariant] = React.useState<any | null>(
    null
  );

  const [state, setState] = useAtom(globalStateAtom);

  const openBox = (product: object) => {
    console.log("product", product);
    setSelectedProduct(product);
    setSelectedVariant(null); // Reset selected variant when a new product is opened
  };

  const closeBox = () => {
    setSelectedProduct(null);
  };

  const selectVariant = (variant: object | string) => {
    console.log("variant", variant);
    setSelectedVariant(variant);
  };

  const handleAddToCart = () => {
    if (!selectedVariant) return; // Prevent adding to cart if no variant is selected

    console.log("selectedProduct", selectedProduct);
    console.log("selectedVariant", selectedVariant);

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

  return (
    <div className="z-0 relative w-full h-auto">
      <div className="mx-auto h-full lg:max-w-[100%] ">
        <div className="grid grid-cols-2 gap-x-1 gap-y-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 2xl:grid-cols-6">
          {products.map((product: any, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.025 }}
              className="relative overflow-hidden">
              <Link
                href={`/shop/${product.productType.toLowerCase()}/${
                  product.handle
                }`}
                className="group cursor-pointer">
                <div className="relative sm:aspect-h-3 sm:aspect-w-2 aspect-1 w-full  bg-gray-200 md:aspect-h-8 md:aspect-w-6 lg:aspect-h-7 lg:aspect-w-6 2xl:aspect-h-6 2xl:aspect-w-5">
                  <Image
                    fill
                    src={product.images[0].src}
                    alt={product.images[0].altText}
                    className="h-full w-full object-cover object-center group-hover:opacity-75"
                  />
                </div>
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
                    initial={{ y: "100%" }}
                    animate={{ y: 0 }}
                    exit={{ y: "100%" }}>
                    <div className="relative">
                      <button
                        className="absolute top-0 right-0 p-1"
                        onClick={closeBox}>
                        X
                      </button>
                      <h2 className="text-lg font-bold mb-4">
                        {product.title}
                      </h2>
                      <ul className="flex space-x-2 mx-auto flex-wrap justify-around w-2/3">
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
                              className={`w-fit items-center underline-animation before:absolute before:inset-0 before:bg-transparent before:transition-all hover:before:bg-transparent relative inline-block ${
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
                      <button
                        className={`mt-4 w-full px-4 py-2 bg-white text-black rounded ${
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
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductGallery;
