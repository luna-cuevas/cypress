"use client";
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
    let classes = "";

    // Mobile (default) breakpoint
    if (gridSize === 1) {
      classes += "grid-cols-1 ";
    } else if (gridSize === 2) {
      classes += "grid-cols-2 ";
    } else {
      classes += "grid-cols-2 "; // Default for mobile
    }

    // Tablet (sm) breakpoint
    if (gridSize <= 2) {
      classes += "sm:grid-cols-2 ";
    } else {
      classes += "sm:grid-cols-3 ";
    }

    // Desktop (lg) breakpoint
    switch (gridSize) {
      case 1:
        classes += "lg:grid-cols-1";
        break;
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
          className={`grid gap-2 sm:gap-3.5 lg:gap-4 ${getGridColumns()} p-1 sm:p-6`}>
          {products &&
            products.map((product: any, index) => (
              <div
                key={product.id}
                className="relative overflow-hidden group/image group dark:hover:bg-white/20 hover:bg-gray-200 flex flex-col bg-gray-50 dark:border dark:border-gray-700 box-border border-gray-200 dark:bg-white/10">
                <Link
                  prefetch={true}
                  tabIndex={1}
                  href={`/shop/${product.productType}/${product.handle}`}
                  className="cursor-pointer relative">
                  <div className="relative sm:aspect-h-3 sm:aspect-w-2 aspect-h-6 aspect-w-4 w-full md:aspect-h-8 md:aspect-w-6 lg:aspect-h-7 lg:aspect-w-6 2xl:aspect-h-8 2xl:aspect-w-6 overflow-hidden">
                    <div className="h-full w-full">
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
                    </div>
                  </div>
                </Link>

                <div className="absolute hidden lg:group-hover:flex bottom-1/4 xl:bottom-[25%] left-0 right-0 z-10 w-fit mx-auto text-white bg-black transition-colors duration-200 backdrop-blur-sm py-2 px-3 rounded-full">
                  <button
                    type="button"
                    className="text-[10px]  w-fit mx-auto "
                    onClick={() => open(product)}>
                    Quick View
                  </button>
                </div>

                <div className="flex h-full flex-col py-4 px-2">
                  <div className="flex flex-col space-y-1.5 w-full">
                    <p className="text-xs tracking-wide text-gray-500 dark:text-gray-400 font-medium">
                      {product.vendor}
                    </p>
                    <h2 className="font-medium text-sm text-gray-800 dark:text-gray-200 truncate">
                      {product.title}
                    </h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      $
                      {parseFloat(product.variants[0].variantPrice)
                        .toFixed(2)
                        .replace(".00", "")
                        .replace(".0", "")}
                    </p>
                  </div>
                </div>
              </div>
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
