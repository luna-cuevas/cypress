import ProductGallery from "@/components/shop/ProductGallery";
import React from "react";
import ProductFilters from "@/components/shop/ProductFilters";
import { productQuery } from "@/utils/productQuery";
import { subCategories } from "@/utils/subCategories";
import { getVendors } from "@/utils/shopify";

type Props = {};

type Sort =
  | "id"
  | "relevance"
  | "price_asc"
  | "price_desc"
  | "created_at"
  | "best_selling";

async function fetchVendors() {
  const availableVendors = await getVendors();
  return availableVendors;
}

const page = async ({
  searchParams,
}: {
  searchParams: {
    sizes?: string;
    sort?: Sort;
    view?: string;
    vendors?: string;
  };
}) => {
  const {
    sizes = "",
    sort,
    view,
    vendors: vendorParam,
  }: {
    sizes?: string;
    sort?: Sort;
    view?: string;
    vendors?: string;
  } = searchParams;

  const sizesArray = sizes ? sizes.split(",") : [];
  const vendorArray = vendorParam ? vendorParam.split(",") : [];

  const query = productQuery({
    sizes: sizesArray,
    vendors: vendorArray,
    sort: sort || undefined,
  });

  const response = await fetch(`${process.env.BASE_URL}/api/fetchProducts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
    },
    body: JSON.stringify({
      productQuery: query,
    }),
  });

  if (!response.ok) {
    console.error("API response error:", response.status, response.statusText);
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();

  // Check for API errors
  if (data.error) {
    console.error("API returned error:", data.error);
    const availableVendors = await fetchVendors();
    return (
      <div className="z-0 relative min-h-[calc(100vh-70px)]">
        <ProductFilters
          productCount={0}
          subCategories={subCategories}
          title="All Products"
          vendors={availableVendors}>
          <div className="p-4 text-center">
            Error loading products. Please try again.
          </div>
        </ProductFilters>
      </div>
    );
  }

  // Extract products from the edges/node structure
  const products =
    data?.products?.edges?.map((edge: any) => {
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

  // Filter products to only include those with matching variants
  const filteredProducts = !sizesArray.length
    ? products
    : products.filter((product: any) => {
        return product.variants.some((variant: any) =>
          sizesArray.some((size) => variant.variantTitle.includes(size))
        );
      });

  const productCount = filteredProducts.length;
  const availableVendors = await fetchVendors();

  return (
    <div className="z-0 relative min-h-[calc(100vh-70px)]">
      <ProductFilters
        productCount={productCount}
        subCategories={subCategories}
        title="All Products"
        vendors={availableVendors}>
        <ProductGallery view={view} products={filteredProducts} />
      </ProductFilters>
    </div>
  );
};

export default page;
