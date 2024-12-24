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
  const view = props.view || "small";
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

  return (
    <div className="z-0 w-full h-auto">
      <div className="mx-auto h-full lg:max-w-[100%] ">
        <div
          className={`grid gap-1 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 `}>
          {products &&
            products.map((product: any, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.025 }}
                className="relative overflow-hidden group/image group flex flex-col ">
                <Link
                  href={`/shop/${product.productType}/${product.handle}`}
                  className="cursor-pointer">
                  <div className="relative sm:aspect-h-3 sm:aspect-w-2 aspect-h-6 aspect-w-4 w-full md:aspect-h-8 md:aspect-w-6 lg:aspect-h-7 lg:aspect-w-6 2xl:aspect-h-8 2xl:aspect-w-6">
                    <Image
                      fill
                      priority
                      quality={100}
                      sizes="(max-width: 640px) 75vw,(min-width: 1024px) 100vw, 33vw"
                      blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mO8fPFiCwAH7wL7Pf/IOAAAAABJRU5ErkJggg=="
                      placeholder="blur"
                      src={product.images[0].src}
                      alt={product.images[0].altText}
                      className="h-full w-full object-cover object-center "
                    />
                    <Image
                      fill
                      priority
                      quality={100}
                      sizes="(max-width: 640px) 75vw,(min-width: 1024px) 100vw, 33vw"
                      blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mO8fPFiCwAH7wL7Pf/IOAAAAABJRU5ErkJggg=="
                      placeholder="blur"
                      src={
                        product.images[1]?.src
                          ? product.images[1].src
                          : product.images[0].src
                      }
                      alt={product.images[0].altText}
                      className="h-full w-full object-cover object-center group-hover/image:opacity-100 opacity-0 transition duration-500"
                    />
                  </div>
                </Link>

                <div
                  className={`absolute hidden group-hover:flex bottom-1/4 xl:bottom-[20%] left-0 right-0 `}>
                  <button
                    type="button"
                    className="text-sm py-2 px-4 rounded-3xl w-fit mx-auto hover:!bg-gray-800 bg-black text-white"
                    onClick={() => open(product)}>
                    Quick View
                  </button>
                </div>

                <div className="flex h-full flex-col items-center pt-2 pb-6 px-2 ">
                  <div className="flex lg:justify-between xl:px-2 dark:text-white w-full justify-center flex-wrap flex-col ">
                    <h2 className="font-light text-sm text-[#444] dark:text-white my-1 order-2 w-fit 2xl:mx-0 ">
                      {product.title}
                    </h2>
                    <p className="text-sm w-fit 2xl:mx-0 text-black dark:text-gray-500 order-1 xl:order-2 items-center h-fit my-auto">
                      ${product.variants[0].variantPrice}0
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
