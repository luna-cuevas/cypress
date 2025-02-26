import ProductGallery from "@/components/shop/ProductGallery";
import React from "react";
import ProductFilters from "@/components/shop/ProductFilters";
import { productQuery } from "@/utils/productQuery";
import { subCategories } from "@/utils/subCategories";
import { getVendors } from "@/utils/shopify";
import { Metadata } from "next";

// Define the type for structured data
type StructuredData = Record<string, unknown>;

// Dynamic metadata generation based on search parameters
export async function generateMetadata({
  searchParams,
}: {
  searchParams: {
    sizes?: string;
    sort?: string;
    view?: string;
    vendors?: string;
  };
}): Promise<Metadata> {
  // Extract search parameters
  const { sizes, vendors: vendorParam, sort } = searchParams;

  // Create title components
  let titlePrefix = "Premium Men's Collection";
  let titleSuffix = "";

  // Add vendor information if available
  if (vendorParam) {
    const vendorNames = vendorParam.split(",").join(", ");
    titlePrefix = `${vendorNames} Collection`;
    titleSuffix = " | Premium Men's Fashion";
  }

  // Add size information if available
  if (sizes) {
    const sizeNames = sizes.split(",").join(", ");
    titleSuffix = `${titleSuffix} | ${sizeNames}`;
  }

  // Add sort information for more specific titles
  if (sort) {
    let sortDesc = "";
    switch (sort) {
      case "price_asc":
        sortDesc = "From Lowest Price";
        break;
      case "price_desc":
        sortDesc = "From Highest Price";
        break;
      case "best_selling":
        sortDesc = "Best Sellers";
        break;
      case "created_at":
        sortDesc = "New Arrivals";
        break;
      default:
        break;
    }

    if (sortDesc) {
      titleSuffix = `${titleSuffix} | ${sortDesc}`;
    }
  }

  // Prepare description with any available filters
  let description =
    "Discover our curated selection of high-end men's apparel. Minimalist designs from exclusive brands";

  if (vendorParam) {
    const vendorNames = vendorParam.split(",").join(", ");
    description = `Explore premium ${vendorNames} men's clothing. ${description}`;
  }

  if (sizes) {
    description = `${description} available in sizes ${sizes
      .split(",")
      .join(", ")}.`;
  } else {
    description = `${description}.`;
  }

  const title = `${titlePrefix}${titleSuffix}`;

  // Prepare structured data
  const itemListSchema: StructuredData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        item: {
          "@type": "Product",
          name: "Premium Men's Collection",
          description: description,
          url: `${process.env.BASE_URL || "https://yourwebsite.com"}/shop`,
          brand: vendorParam
            ? { "@type": "Brand", name: vendorParam.split(",")[0] }
            : undefined,
          category: "Apparel & Accessories > Clothing > Men's Fashion",
          image: "/images/og-shop.jpg",
          offers: {
            "@type": "AggregateOffer",
            priceCurrency: "USD",
            availability: "https://schema.org/InStock",
          },
        },
      },
    ],
  };

  const breadcrumbSchema: StructuredData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: `${process.env.BASE_URL || "https://yourwebsite.com"}`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Shop",
        item: `${process.env.BASE_URL || "https://yourwebsite.com"}/shop`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: vendorParam || "All Collections",
        item: `${process.env.BASE_URL || "https://yourwebsite.com"}/shop${
          vendorParam ? `?vendors=${vendorParam}` : ""
        }`,
      },
    ],
  };

  // Return the metadata object
  return {
    title: title,
    description: description,
    keywords: `premium menswear, designer clothing, minimalist fashion, high-end apparel, exclusive brands${
      vendorParam ? ", " + vendorParam.replace(/,/g, ", ") : ""
    }`,
    openGraph: {
      title: title,
      description: description,
      type: "website",
      locale: "en_US",
      images: [
        {
          url: "/images/og-shop.jpg",
          width: 1200,
          height: 630,
          alt: "Premium men's fashion collection",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: title,
      description: description,
      images: ["/images/og-shop.jpg"],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    alternates: {
      canonical: `/shop${
        new URLSearchParams(searchParams as Record<string, string>).toString()
          ? "?" +
            new URLSearchParams(
              searchParams as Record<string, string>
            ).toString()
          : ""
      }`,
    },
    // Add structured data for rich results
    other: {
      "json-ld": JSON.stringify([itemListSchema, breadcrumbSchema]),
    },
  };
}

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

  console.log("filteredProducts", filteredProducts);

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
