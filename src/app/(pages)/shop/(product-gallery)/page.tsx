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

  // Debug the incoming filter parameters
  console.log("Filter parameters:", {
    sizes: sizesArray,
    vendors: vendorArray,
    sort,
    view,
  });

  const query = productQuery({
    sizes: sizesArray,
    vendors: vendorArray,
    sort: sort || undefined,
  });

  // Debug the query being sent
  console.log("Query being sent to API:", query);

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

  // Debug raw response
  console.log("Raw response data structure:", {
    hasData: !!data,
    hasProducts: !!data?.products,
    hasEdges: !!data?.products?.edges,
    edgesLength: data?.products?.edges?.length,
    firstEdge: data?.products?.edges?.[0],
    query: query, // Log the query that was sent
  });

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
        // Debug variant matching
        console.log("Checking variants for product:", {
          title: product.title,
          variants: product.variants.map((v: any) => v.variantTitle),
          searching: sizesArray,
        });

        return product.variants.some((variant: any) =>
          sizesArray.some((size) => variant.variantTitle.includes(size))
        );
      });

  // Debug filtered results
  console.log("Final filtered products:", {
    originalCount: products.length,
    filteredCount: filteredProducts.length,
    appliedSizes: sizesArray,
    sampleTitles: filteredProducts.slice(0, 3).map((p: any) => p.title),
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
