"use client";
import { globalStateAtom } from "@/context/atoms";
import { motion } from "framer-motion";
import { useAtom } from "jotai";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { QuickViewDrawer } from "./QuickViewDrawer";

type Props = {
  view?: string;
  gridSize?: number;
  products: {
    id: string;
    handle: string;
    productType: string;
    images: { src: string; altText: string }[];
    title: string;
    vendor: string;
    variants: any[];
  }[];
};

const ProductGallery = (props: Props) => {
  const products = Array.isArray(props.products) ? props.products : [];
  const gridSize = props.gridSize || 4; // Default to 4 if not provided

  // Get grid columns class based on size
  const getGridColumns = () => {
    // Always 2 columns on mobile
    let classes = "grid-cols-2 ";

    // Tablet (sm) breakpoint
    if (gridSize === 2) classes += "sm:grid-cols-2 ";
    else classes += "sm:grid-cols-3 ";

    // Desktop (lg) breakpoint
    switch (gridSize) {
      case 2:
        classes += "lg:grid-cols-2";
        break;
      case 3:
        classes += "lg:grid-cols-3";
        break;
      case 4:
        classes += "lg:grid-cols-4";
        break;
      case 5:
        classes += "lg:grid-cols-5";
        break;
      default:
        classes += "lg:grid-cols-4";
    }

    return classes;
  };

  const [selectedProduct, setSelectedProduct] = React.useState<any | null>(
    null
  );
  const [selectedVariant, setSelectedVariant] = React.useState<any | null>(
    null
  );

  const [state, setState] = useAtom(globalStateAtom);

  const open = (product: any) => {
    setSelectedProduct(product);
    setSelectedVariant(product.variants[0]); // Set the first variant as default
  };

  const closeBox = () => {
    setSelectedProduct(null);
    setSelectedVariant(null);
  };

  const selectVariant = (variant: any) => {
    setSelectedVariant(variant);
  };

  // Debug products data
  console.log("Products data:", {
    isArray: Array.isArray(props.products),
    rawProducts: props.products,
    processedProducts: products,
  });

  if (!products.length) {
    return (
      <div className="w-full h-full flex items-center justify-center py-12">
        <p className="text-gray-500 dark:text-gray-400">No products found</p>
      </div>
    );
  }

  return (
    <div className="z-0 w-full h-auto">
      <div className="mx-auto h-full lg:max-w-[100%] ">
        <div
          className={`grid gap-2 sm:gap-3.5 lg:gap-4 ${getGridColumns()} p-4 sm:p-6`}>
          {products &&
            products.map((product: any, index) => (
              <motion.div
                key={product.id}
                // animate in and out
                initial={{ opacity: 0, y: 100 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -100 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative overflow-hidden group/image group dark:hover:bg-white/10 hover:bg-black/10 flex flex-col bg-white dark:bg-black">
                <Link
                  tabIndex={1}
                  href={`/shop/${product.productType}/${product.handle}`}
                  className="cursor-pointer relative">
                  <div className="relative sm:aspect-h-3 sm:aspect-w-2 aspect-h-6 aspect-w-4 w-full md:aspect-h-8 md:aspect-w-6 lg:aspect-h-7 lg:aspect-w-6 2xl:aspect-h-8 2xl:aspect-w-6 overflow-hidden">
                    <motion.div
                      initial={{ scale: 1 }}
                      whileHover={{ scale: 1.05 }}
                      transition={{
                        duration: 0.6,
                        ease: [0.43, 0.13, 0.23, 0.96],
                      }}
                      className="h-full w-full">
                      <Image
                        fill
                        priority
                        quality={100}
                        sizes="(max-width: 640px) 75vw,(min-width: 1024px) 100vw, 33vw"
                        blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mO8fPFiCwAH7wL7Pf/IOAAAAABJRU5ErkJggg=="
                        placeholder="blur"
                        src={product.images[0].src}
                        alt={product.images[0].altText}
                        className="h-full w-full object-cover object-center transition-opacity duration-300"
                      />
                      <Image
                        fill
                        priority
                        quality={100}
                        sizes="(max-width: 640px) 75vw,(min-width: 1024px) 100vw, 33vw"
                        blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mO8fPFiCwAH7wL7Pf/IOAAAAABJRU5ErkJggg=="
                        placeholder="blur"
                        src={product.images[1]?.src || product.images[0].src}
                        alt={product.images[0].altText}
                        className="h-full w-full object-cover object-center opacity-0 group-hover/image:opacity-100 transition-opacity duration-500"
                      />
                    </motion.div>
                  </div>
                </Link>

                {/* <motion.div
                  tabIndex={0}
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  className="absolute cursor-pointer inset-0 dark:group-hover:bg-white/10 bg-black/5 group-hover:bg-black/10 transition-colors duration-300"
                /> */}

                <motion.div className="absolute hidden group-hover:flex bottom-1/4 xl:bottom-[20%] left-0 right-0 z-10">
                  <button
                    type="button"
                    className="text-sm py-2.5 px-6 rounded-full w-fit mx-auto bg-white/90 hover:bg-white text-black transition-colors duration-200 backdrop-blur-sm"
                    onClick={() => open(product)}>
                    Quick View
                  </button>
                </motion.div>

                <div className="flex h-full flex-col pt-4 pb-6 px-2">
                  <div className="flex flex-col space-y-1.5 w-full">
                    <p className="text-xs tracking-wide text-gray-500 dark:text-gray-400 font-medium uppercase">
                      {product.vendor}
                    </p>
                    <h2 className="font-light text-sm text-black dark:text-white truncate">
                      {product.title}
                    </h2>
                    <p className="text-sm text-black dark:text-gray-300">
                      ${parseFloat(product.variants[0].variantPrice).toFixed(2)}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
        </div>
      </div>
      {selectedProduct && (
        <QuickViewDrawer
          open={open}
          product={selectedProduct}
          variant={selectedVariant}
          selectVariant={selectVariant}
          selectedProduct={selectedProduct}
          closeBox={closeBox}
        />
      )}
    </div>
  );
};

export default ProductGallery;
