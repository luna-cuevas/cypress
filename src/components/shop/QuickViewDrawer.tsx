"use client";
import React, { useState, useEffect } from "react";
import { Drawer } from "@material-tailwind/react";
import { ThemeProvider } from "@material-tailwind/react";
import Carousel from "./Carousel";
import { Radio, RadioGroup } from "@headlessui/react";
import AddToCartButton from "./AddToCartButton";
import Link from "next/link";
import FavoriteButton from "./FavoriteButton";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { motion } from "framer-motion";

type Props = {
  product: {
    id: string;
    handle: string;
    productType: string;
    images: { src: string; altText: string }[];
    title: string;
    variants: any[];
  };
  selectedProduct: any;
  open: any;
  closeBox: any;
  variant: any;
  selectVariant: any;
};

interface DrawerStylesType {
  defaultProps: {
    size: number;
    overlay: boolean;
    placement: "top" | "right" | "bottom" | "left";
    overlayProps: React.ClassAttributes<HTMLDivElement> &
      React.HTMLAttributes<HTMLDivElement>;
    className: string;
    dismiss: {
      enabled: boolean;
      escapeKey: boolean;
      referencePress: boolean;
      referencePressEvent: "pointerdown" | "mousedown" | "click";
      outsidePress: boolean | ((event: MouseEvent) => boolean);
      outsidePressEvent: "pointerdown" | "mousedown" | "click";
      ancestorScroll: boolean;
      bubbles:
        | boolean
        | {
            escapeKey: boolean;
            outsidePress: boolean;
          };
    };
    onClose: () => void;
    transition: object;
  };
  styles: {
    base: {
      container: object;
      overlay: object;
      drawer: object;
    };
  };
}

function classNames(...classes: any[]) {
  return classes.filter(Boolean).join(" ");
}

export function QuickViewDrawer(props: Props) {
  const { product, open, variant, selectVariant, selectedProduct, closeBox } =
    props;

  const theme = {
    drawer: {
      defaultProps: {
        size: 550,
        overlay: true,
        placement: "right",
        overlayProps: undefined,
        className: "",
        dismiss: undefined,
        onClose: undefined,
        transition: {
          type: "tween",
          duration: 0.5,
        },
      },
      styles: {
        base: {
          drawer: {
            position: "fixed",
            zIndex: "z-[1000000000000]",
            pointerEvents: "pointer-events-auto",
            backgroundColor: "bg-white",
            boxSizing: "box-border",
            width: "w-full",
            boxShadow: "shadow-2xl shadow-blue-gray-900/10",
          },
          overlay: {
            position: "fixed",
            inset: "inset-0",
            width: "w-full",
            height: "h-full",
            pointerEvents: "pointer-events-auto",
            zIndex: "z-[9999]",
            backgroundColor: "bg-black",
            backgroundOpacity: "bg-opacity-70",
            backdropBlur: "backdrop-blur-sm",
          },
        },
      },
    },
  };

  const [selectedVariant, setSelectedVariant] = useState<any>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (selectedProduct) {
      const timer = setTimeout(() => setLoaded(true), 100);
      return () => clearTimeout(timer);
    } else {
      setLoaded(false);
    }
  }, [selectedProduct]);

  return (
    <ThemeProvider value={theme}>
      <Drawer
        open={selectedProduct ? true : false}
        onClose={closeBox}
        placement="right"
        className="pt-0 px-0 dark:bg-black border-l border-gray-100 dark:border-gray-800">
        <div className="w-full h-full flex flex-col">
          <button
            onClick={closeBox}
            className="absolute right-5 top-5 z-10 p-2 rounded-full bg-white/80 dark:bg-black/80 backdrop-blur-sm hover:bg-white dark:hover:bg-black transition-all duration-300 text-gray-800 dark:text-white">
            <XMarkIcon className="h-5 w-5" />
          </button>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: loaded ? 1 : 0 }}
            transition={{ duration: 0.6 }}
            className="h-[800px] w-full relative">
            <Carousel slides={selectedProduct?.images} />
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: loaded ? 0 : 20, opacity: loaded ? 1 : 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col px-10 py-8 gap-2 h-full overflow-y-auto scrollbar-hide">
            <p className="text-xs uppercase tracking-widest text-gray-500 dark:text-gray-400 font-light">
              {selectedProduct?.productType || ""}
            </p>

            <h2 className="text-2xl font-light tracking-wide text-gray-900 dark:text-white">
              {selectedProduct?.title}
            </h2>

            <p className="text-lg font-light text-gray-900 dark:text-white mb-2">
              ${selectedProduct?.variants[0].variantPrice}0
            </p>

            <div className="w-full h-px bg-gray-200 dark:bg-gray-800 my-2"></div>

            <div className="my-4">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-sm tracking-wide font-light text-gray-600 dark:text-gray-300">
                  {selectedVariant?.variantTitle ? (
                    <span className="flex gap-2 items-center">
                      SIZE:
                      <span className="text-black dark:text-white font-normal">
                        {selectedVariant.variantTitle}
                      </span>
                    </span>
                  ) : (
                    "SELECT SIZE"
                  )}
                </h3>
                <Link
                  href="#"
                  className="text-xs uppercase tracking-wider font-light text-gray-800 hover:text-black dark:text-gray-300 dark:hover:text-white">
                  Size guide
                </Link>
              </div>

              <fieldset aria-label="Choose a size">
                <RadioGroup
                  value={selectedVariant?.variantTitle}
                  className="grid grid-cols-4 gap-3">
                  {product?.variants.map(
                    (
                      variant: {
                        name: string;
                        variantQuantityAvailable: number;
                        variantTitle: string;
                      },
                      index: number
                    ) => (
                      <Radio
                        key={index}
                        value={variant}
                        onClick={() => setSelectedVariant(variant)}
                        disabled={variant.variantQuantityAvailable === 0}
                        className={({ focus }) =>
                          classNames(
                            variant.variantQuantityAvailable
                              ? "cursor-pointer bg-transparent text-gray-900 dark:text-white"
                              : "cursor-not-allowed bg-gray-50 dark:bg-gray-900 text-gray-200 dark:text-gray-700",
                            focus ? "ring-1 ring-black dark:ring-white" : "",
                            "group relative flex items-center justify-center border dark:border-gray-700 py-3 text-xs font-light tracking-wide uppercase hover:border-black dark:hover:border-white focus:outline-none transition-all duration-200"
                          )
                        }>
                        {({ checked, focus }) => (
                          <>
                            <span>{variant.variantTitle}</span>
                            {variant.variantQuantityAvailable > 0 ? (
                              <span
                                className={classNames(
                                  selectedVariant?.variantTitle ==
                                    variant.variantTitle
                                    ? "border-black dark:border-white"
                                    : "border-transparent",
                                  focus ? "border" : "border-2",
                                  "pointer-events-none absolute -inset-px"
                                )}
                                aria-hidden="true"
                              />
                            ) : (
                              <span
                                aria-hidden="true"
                                className="pointer-events-none absolute -inset-px border border-gray-200 dark:border-gray-700">
                                <svg
                                  className="absolute inset-0 h-full w-full stroke-2 text-gray-200 dark:text-gray-700"
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

            <div className="w-full h-px bg-gray-200 dark:bg-gray-800 my-2"></div>

            <div className="mt-auto ">
              <div className="flex items-center gap-3">
                <AddToCartButton
                  closeBox={closeBox}
                  product={product}
                  selectedVariant={selectedVariant}
                />
                <FavoriteButton
                  productId={selectedProduct?.id}
                  productTitle={selectedProduct?.title}
                  productImage={selectedProduct?.images[0]?.src || ""}
                  productPrice={selectedProduct?.variants[0]?.variantPrice || 0}
                  productHandle={selectedProduct?.handle}
                />
              </div>

              <Link
                className="block text-xs tracking-wider uppercase mt-8 text-center font-light text-gray-800 hover:text-black dark:text-gray-300 dark:hover:text-white transition-colors duration-200"
                href={`shop/${selectedProduct?.productType}/${selectedProduct?.handle}`}>
                View product details
              </Link>
            </div>
          </motion.div>
        </div>
      </Drawer>
    </ThemeProvider>
  );
}
