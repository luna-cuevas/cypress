"use client";
import React, { useState } from "react";
import { Drawer } from "@material-tailwind/react";
import { ThemeProvider } from "@material-tailwind/react";
import Carousel from "./Carousel";
import { Radio, RadioGroup } from "@headlessui/react";
import AddToCartButton from "./AddToCartButton";
import Link from "next/link";

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
        size: 475,
        overlay: true,
        placement: "left",
        overlayProps: undefined,
        className: "",
        dismiss: undefined,
        onClose: undefined,
        transition: {
          type: "tween",
          duration: 0.3,
        },
      },
      styles: {
        base: {
          drawer: {
            position: "fixed",
            zIndex: "z-[9999]",
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
            backgroundOpacity: "bg-opacity-60",
            backdropBlur: "backdrop-blur-sm",
          },
        },
      },
    },
  };

  const [selectedVariant, setSelectedVariant] = useState<any>(null);

  return (
    <ThemeProvider value={theme}>
      <Drawer
        open={selectedProduct ? true : false}
        onClose={closeBox}
        placement="right"
        className="pt-2 px-8 ">
        <div className="w-full h-full flex flex-col">
          <button
            onClick={closeBox}
            className="w-fit mb-2 ml-auto text-xl  shadow-md rounded-full px-2 text-gray-800 dark:text-white">
            x
          </button>
          <div className="h-[450px]">
            <Carousel slides={selectedProduct?.images} />
          </div>

          <div className="flex overflow-y-scroll flex-col gap-2 my-2">
            <h2 className=" text-xl font-semibold">{selectedProduct?.title}</h2>

            <p className="">${selectedProduct?.variants[0].variantPrice}0</p>
            <div className="mt-2">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-gray-600">
                  {selectedVariant?.variantTitle ? (
                    <span className="gap-1 flex">
                      Size
                      <span className=" text-black">
                        {selectedVariant.variantTitle}
                      </span>
                    </span>
                  ) : (
                    "Select Size"
                  )}
                </h3>
                <Link
                  href="#"
                  className="text-sm underline font-medium text-gray-800 hover:text-cypress-green-light">
                  Size guide
                </Link>
              </div>
              <fieldset aria-label="Choose a size" className="mt-4">
                <RadioGroup
                  value={selectedVariant?.variantTitle}
                  className="grid grid-cols-3 gap-2 ">
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
                              ? "cursor-pointer bg-white text-gray-900 shadow-sm"
                              : "cursor-not-allowed bg-gray-50 text-gray-200",
                            focus ? "ring-2 ring-indigo-500" : "",
                            "group relative flex items-center justify-center  border py-3 text-sm font-medium uppercase hover:bg-gray-50 focus:outline-none sm:flex-1 "
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
                                    ? "border-cypress-green"
                                    : "border-transparent",
                                  focus ? "border" : "border-2",
                                  "pointer-events-none absolute -inset-px "
                                )}
                                aria-hidden="true"
                              />
                            ) : (
                              <span
                                aria-hidden="true"
                                className="pointer-events-none absolute -inset-px  border-2 border-gray-200">
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
          </div>

          <div className="h-full  flex-1 justify-end gap-4 mb-6 flex flex-col">
            <div className="flex gap-2  items-center">
              <AddToCartButton
                closeBox={closeBox}
                product={product}
                selectedVariant={selectedVariant}
              />
              <button type="button">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-8">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
                  />
                </svg>
              </button>
            </div>
            <Link
              className="text-sm underline mx-auto font-medium text-gray-800 hover:text-cypress-green-light"
              href={`shop/${selectedProduct?.productType}/${selectedProduct?.handle}`}>
              View product details
            </Link>
          </div>
        </div>
      </Drawer>
    </ThemeProvider>
  );
}
