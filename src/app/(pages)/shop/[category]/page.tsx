import ProductFilters from "@/components/shop/ProductFilters";
import ProductGallery from "@/components/shop/ProductGallery";
// import fetchProducts from "@/utils/fetchProducts";
import { productQuery } from "@/utils/productQuery";
import { headers } from "next/headers";
import React from "react";

type Props = {};

const page = async ({
  params,
  searchParams,
}: {
  params: {
    category: string;
  };
  searchParams: { sizes: any[] };
}) => {
  const category = params.category;
  const { sizes } = searchParams;
  const sizesArray = sizes ? (sizes as any).split(",") : [];
  const capitalized = category.charAt(0).toUpperCase() + category.slice(1);

  const response = await fetch(`${process.env.BASE_URL}/api/fetchProducts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
    },
    body: JSON.stringify({
      productQuery: productQuery({ category: capitalized, sizes: sizesArray }),
    }),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  const products = data.products;

  return (
    <div className="z-0 relative h-[calc(100vh-70px)] ">
      <ProductFilters title={params.category}>
        <ProductGallery products={products} />
      </ProductFilters>
    </div>
  );
};

export default page;
