import fetchProducts from "@/utils/fetchProducts";
import ProductGallery from "@/components/shop/ProductGallery";
import React from "react";

type Props = {};

const page = async (props: Props) => {
  const products = await fetchProducts();

  return (
    <div className="z-0 relative">
      <ProductGallery products={products} />
    </div>
  );
};

export default page;
