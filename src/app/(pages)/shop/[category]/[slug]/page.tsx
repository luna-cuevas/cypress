import React from "react";
import { useParams } from "next/navigation";
import { productQuery } from "@/utils/productQuery";
import ProductDetails from "@/components/shop/ProductDetails";

type Props = {};

const ProductPage = async ({ params }: { params: { slug: string } }) => {
  const { slug } = params;

  const response = await fetch(`${process.env.BASE_URL}/api/fetchProducts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      productQuery: productQuery({
        handle: slug,
      }),
    }),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();

  if (!data) {
    return <div>No product found</div>;
  }

  const product = data.product;

  return (
    <div className="z-0 relative min-h-[calc(100vh-70px)] ">
      <ProductDetails product={product} />
    </div>
  );
};

export default ProductPage;
