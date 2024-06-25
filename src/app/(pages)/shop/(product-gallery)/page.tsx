import fetchProducts from "@/app/utils/fetchProducts";
import ProductGallery from "@/components/shop/ProductGallery";
import React from "react";

type Props = {};

const page = async (props: Props) => {
  const products = await fetchProducts();

  return (
    <div>
      <ProductGallery products={products} />
    </div>
  );
};

export default page;
