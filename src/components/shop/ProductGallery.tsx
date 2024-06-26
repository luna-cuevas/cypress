"use client";
import Link from "next/link";
import React from "react";

type Props = {
  products?: any[];
};

const ProductGallery = (props: Props) => {
  const products = props.products || [];
  console.log("products", products);
  return (
    <div className="bg-white z-0 relative">
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
        <h1 className="my-4 flex justify-center text-2xl">Products</h1>

        <div className="grid  grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
          {products.map((product: any) => (
            <Link
              key={product.id}
              href={`/shop/${product.handle}`}
              className="group cursor-pointer">
              <div className="aspect-h-1  aspect-w-1 w-full overflow-hidden rounded-lg bg-gray-200 xl:aspect-h-8 xl:aspect-w-7">
                <img
                  src={product.images[0].src}
                  alt={product.images[0].altText}
                  className="h-full w-full object-cover object-center group-hover:opacity-75"
                />
              </div>
              <h3 className="mt-4 text-sm text-gray-700">{product.handle}</h3>
              <p className="mt-1 text-lg font-medium text-gray-900">
                {product.variants[0].variantPrice}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductGallery;
