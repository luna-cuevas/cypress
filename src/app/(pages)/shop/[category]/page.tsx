import ProductFilters from "@/components/shop/ProductFilters";
import ProductGallery from "@/components/shop/ProductGallery";
import { productQuery } from "@/utils/productQuery";
import React from "react";
import { subCategories } from "@/utils/subCategories";

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
  const productCount = products.length;

  return (
    <div className="z-0 relative">
      <ProductFilters
        productCount={productCount}
        subCategories={subCategories}
        title={params.category}>
        <ProductGallery products={products} />
      </ProductFilters>
    </div>
  );
};

export default page;
