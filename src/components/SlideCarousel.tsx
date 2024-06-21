"use client";
import Image from "next/image";
import React, { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAtom } from "jotai";
import { globalStateAtom } from "@/context/atoms";

type Props = {
  products?: any[];
};

const SlideCarousel: React.FC<Props> = ({ products }) => {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [state, setState] = useAtom(globalStateAtom);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<any | null>(null);

  useEffect(() => {
    console.log("products", products);
    const carousel = carouselRef.current;

    if (!carousel) return;

    const handleMouseDown = (e: MouseEvent) => {
      setIsDragging(true);
      setStartX(e.pageX - carousel.offsetLeft);
      setScrollLeft(carousel.scrollLeft);
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      e.preventDefault();
      const x = e.pageX - carousel.offsetLeft;
      const walk = (x - startX) * 1;
      carousel.scrollLeft = scrollLeft - walk;
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    const handleTouchStart = (e: TouchEvent) => {
      setIsDragging(true);
      setStartX(e.touches[0].pageX - carousel.offsetLeft);
      setScrollLeft(carousel.scrollLeft);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDragging) return;
      const x = e.touches[0].pageX - carousel.offsetLeft;
      const walk = (x - startX) * 1;
      carousel.scrollLeft = scrollLeft - walk;
    };

    const handleTouchEnd = () => {
      setIsDragging(false);
    };

    carousel.addEventListener("mousedown", handleMouseDown);
    carousel.addEventListener("mousemove", handleMouseMove);
    carousel.addEventListener("mouseup", handleMouseUp);
    carousel.addEventListener("mouseleave", handleMouseUp);
    carousel.addEventListener("touchstart", handleTouchStart);
    carousel.addEventListener("touchmove", handleTouchMove);
    carousel.addEventListener("touchend", handleTouchEnd);

    return () => {
      carousel.removeEventListener("mousedown", handleMouseDown);
      carousel.removeEventListener("mousemove", handleMouseMove);
      carousel.removeEventListener("mouseup", handleMouseUp);
      carousel.removeEventListener("mouseleave", handleMouseUp);
      carousel.removeEventListener("touchstart", handleTouchStart);
      carousel.removeEventListener("touchmove", handleTouchMove);
      carousel.removeEventListener("touchend", handleTouchEnd);
    };
  }, [isDragging, startX, scrollLeft]);

  const openBox = (product: object) => {
    console.log("product", product);
    setSelectedProduct(product);
  };

  const closeBox = () => {
    setSelectedProduct(null);
  };

  const selectVariant = (variant: object | string) => {
    console.log("variant", variant);
    setSelectedVariant(variant);
  };

  const handleAddToCart = () => {
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
            product: selectedProduct,
            variant: selectedVariant,
          },
        ],
      });
    }
  };

  return (
    <div className="w-full relative px-2 overflow-hidden">
      <div ref={carouselRef} className="flex space-x-1 overflow-x-auto">
        {products &&
          products.map((product) => (
            <div
              key={product.id}
              className="w-[200px] relative h-[300px] bg-gray-300 flex-shrink-0">
              <Image
                priority
                fill
                sizes="
                (max-width: 640px) 100vw,
                (max-width: 1024px) 50vw,
                33vw
                "
                blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mO8fPFiCwAH7wL7Pf/IOAAAAABJRU5ErkJggg=="
                placeholder="blur"
                quality={50}
                src={product.images[0].src}
                alt={product.images[0].altText}
                draggable={false}
                className="w-full h-full object-cover cursor-pointer"
              />
              <button
                type="button"
                className="absolute bottom-0 text-2xl right-0 px-2 py-0 hover:bg-gray-600 bg-black text-white"
                onClick={() => openBox(product)}>
                +
              </button>
              <AnimatePresence>
                {selectedProduct?.id === product.id && (
                  <motion.div
                    className="absolute bottom-0 left-0 w-full bg-black bg-opacity-75 p-4 text-white z-50"
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
                      <ul className="flex space-x-2 mx-auto justify-around w-2/3">
                        {product.variants.length === 1 ? (
                          <button
                            type="button"
                            onClick={() => {
                              selectVariant(product.variants[0]);
                            }}
                            className="w-fit  items-center underline-animation before:absolute before:inset-0 before:bg-transparent before:transition-all hover:before:bg-transparent relative inline-block ">
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
                              className="w-full  items-center underline-animation before:absolute before:inset-0 before:bg-transparent before:transition-all hover:before:bg-transparent relative inline-block ">
                              <span>{variant.variantTitle}</span>
                            </button>
                          ))
                        )}
                      </ul>
                      <button
                        className="mt-4 w-full px-4 py-2 bg-white text-black rounded"
                        onClick={() => {
                          handleAddToCart();
                        }}>
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