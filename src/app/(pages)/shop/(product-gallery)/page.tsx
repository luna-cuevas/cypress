import ProductGallery from "@/components/shop/ProductGallery";
import React from "react";
import ProductFilters from "@/components/shop/ProductFilters";
import { productQuery } from "@/utils/productQuery";
import { useSearchParams } from "next/navigation";

type Props = {};

type Sort =
  | "id"
  | "relevance"
  | "price_asc"
  | "price_desc"
  | "created_at"
  | "best_selling";

const page = async ({
  searchParams,
  props,
}: {
  searchParams: { sizes: string; sort: Sort; view: string };
  props: Props;
}) => {
  const { sizes, sort, view }: { sizes: string; sort?: Sort; view: string } =
    searchParams;
  const sizesArray = sizes ? (sizes as any).split(",") : [];

  const response = await fetch(`${process.env.BASE_URL}/api/fetchProducts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      productQuery: productQuery({
        sizes: sizesArray.length > 0 ? sizesArray : undefined,
        sort: sort ? sort : undefined,
      }),
    }),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();

  if (!data) {
    return console.error("No data returned from fetchProducts");
  }

  const products = data.products;

  return (
    <div className="z-0 relative min-h-[calc(100vh-70px)] ">
      <ProductFilters title="All Products">
        <ProductGallery view={view} products={products} />
      </ProductFilters>
    </div>
  );
};

export default page;
