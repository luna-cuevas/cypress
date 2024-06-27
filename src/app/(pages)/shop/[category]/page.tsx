import ProductFilters from "@/components/shop/ProductFilters";
import ProductGallery from "@/components/shop/ProductGallery";
// import fetchProducts from "@/utils/fetchProducts";
import { productQuery } from "@/utils/productQuery";
import { headers } from "next/headers";
import React from "react";

type Props = {};

const page = async ({
  params,
}: {
  params: {
    category: string;
  };
}) => {
  const category = params.category;

  const response = await fetch(`${process.env.BASE_URL}/api/fetchProducts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ productQuery: productQuery(category) }),
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
