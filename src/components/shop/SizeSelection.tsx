"use client";

import { Radio, RadioGroup } from "@headlessui/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

function classNames(...classes: any[]) {
  return classes.filter(Boolean).join(" ");
}

export default function SizeSelection({
  product,
  selectedVariant,
}: {
  product: any;
  selectedVariant: any;
}) {
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams.toString());
  const router = useRouter();

  const selectVariant = (variant: any) => {
    params.set("variantSize", variant.variantTitle);
    router.replace(`?${params.toString()}`, { scroll: false });
  };

  useEffect(() => {
    if ("scrollRestoration" in history) {
      history.scrollRestoration = "manual";
      window.addEventListener("popstate", handleScroll);
    }

    return () => {
      window.removeEventListener("popstate", handleScroll);
    };
  }, []);

  const handleScroll = () => {
    const scrollPosition = sessionStorage.getItem("scrollPosition");
    if (scrollPosition) {
      window.scrollTo(0, parseInt(scrollPosition, 10));
    }
  };

  useEffect(() => {
    const onScroll = () => {
      sessionStorage.setItem("scrollPosition", window.scrollY.toString());
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <fieldset aria-label="Choose a size" className="mt-4">
      <RadioGroup
        value={selectedVariant?.variantTitle}
        className="grid grid-cols-3 gap-2 sm:grid-cols-4 2xl:grid-cols-6">
        {product.variants.map(
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
              onClick={() => selectVariant(variant)}
              disabled={variant.variantQuantityAvailable === 0}
              className={({ focus }) =>
                classNames(
                  variant.variantQuantityAvailable
                    ? "cursor-pointer bg-white text-gray-900 shadow-sm"
                    : "cursor-not-allowed bg-gray-50 text-gray-200",
                  focus ? "ring-2 ring-indigo-500" : "",
                  "group relative flex items-center justify-center  border p-2 text-sm font-medium uppercase hover:bg-gray-50 focus:outline-none sm:flex-1 "
                )
              }>
              {({ checked, focus }) => (
                <>
                  <span>{variant.variantTitle}</span>
                  {variant.variantQuantityAvailable > 0 ? (
                    <span
                      className={classNames(
                        selectedVariant?.variantTitle == variant.variantTitle
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
  );
}
