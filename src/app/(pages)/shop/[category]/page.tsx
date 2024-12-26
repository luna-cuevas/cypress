import ProductFilters from "@/components/shop/ProductFilters";
import ProductGallery from "@/components/shop/ProductGallery";
import { productQuery } from "@/utils/productQuery";
import React from "react";
import { subCategories } from "@/utils/subCategories";
import { getVendors } from "@/utils/shopify";

type Props = {};

async function fetchVendors() {
  const vendors = await getVendors();
  return vendors;
}

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

  // Transform products from edges/nodes structure
  const products =
    data.products?.edges?.map((edge: any) => {
      const product = edge.node;
      return {
        id: product.id,
        title: product.title,
        vendor: product.vendor,
        handle: product.handle,
        productType: product.productType,
        description: product.description,
        variants:
          product.variants?.edges?.map((variantEdge: any) => ({
            variantId: variantEdge.node.id,
            variantTitle: variantEdge.node.title,
            variantPrice: variantEdge.node.price.amount,
            variantCurrencyCode: variantEdge.node.price.currencyCode,
            variantQuantityAvailable: variantEdge.node.quantityAvailable,
          })) || [],
        images:
          product.images?.edges?.map((imageEdge: any) => ({
            src: imageEdge.node.src,
            altText: imageEdge.node.altText || "",
          })) || [],
      };
    }) || [];

  // Filter products to only include those with matching variants if sizes are specified
  const filteredProducts = !sizesArray.length
    ? products
    : products.filter((product: any) =>
        product.variants.some((variant: any) =>
          sizesArray.some((size: string) => variant.variantTitle.includes(size))
        )
      );

  const productCount = filteredProducts.length;

  const availableVendors = await fetchVendors();

  return (
    <div className="z-0 relative">
      <ProductFilters
        productCount={productCount}
        subCategories={subCategories}
        vendors={availableVendors}>
        <ProductGallery products={filteredProducts} />
      </ProductFilters>
    </div>
  );
};

export default page;
