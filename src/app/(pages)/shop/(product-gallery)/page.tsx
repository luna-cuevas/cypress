import ProductGallery from "@/components/shop/ProductGallery";
import React from "react";
import ProductFilters from "@/components/shop/ProductFilters";
import { productQuery } from "@/utils/productQuery";

type Props = {};

const page = async (props: Props) => {
  const response = await fetch(`${process.env.BASE_URL}/api/fetchProducts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ productQuery: productQuery() }),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  const products = data.products;

  return (
    <div className="z-0 relative min-h-[calc(100vh-70px)] ">
      <ProductFilters title="All Products">
        <ProductGallery products={products} />
      </ProductFilters>
    </div>
  );
};

export default page;
