import ProductFilters from "@/components/shop/ProductFilters";
import ProductGallery from "@/components/shop/ProductGallery";
import { productQuery } from "@/utils/productQuery";
import React from "react";
import { subCategories } from "@/utils/subCategories";
import { getVendors } from "@/utils/shopify";
import { Metadata } from "next";

// Define the type for structured data
type StructuredData = Record<string, unknown>;

// Dynamic metadata generation based on category and search parameters
export async function generateMetadata({
  params,
  searchParams,
}: {
  params: { category: string };
  searchParams: {
    sizes?: string;
    view?: string;
    price?: string;
  };
}): Promise<Metadata> {
  const category = params.category;
  const { sizes, view, price } = searchParams;

  // Format category for display
  const capitalized = category.charAt(0).toUpperCase() + category.slice(1);
  const formattedCategory = capitalized.replace(/-/g, " ");

  // Create title components
  let title = `${formattedCategory} Collection | Premium Men's Fashion`;
  let titleSuffix = title;

  // Add size information if available
  if (sizes) {
    const sizeNames = sizes.split(",").join(", ");
    titleSuffix = `${titleSuffix} | ${sizeNames}`;
  }

  // Add price range information if available
  if (price) {
    let priceDesc = "";
    if (price === "0-300") {
      priceDesc = "Under $300";
    } else if (price === "300-600") {
      priceDesc = "$300-$600";
    } else if (price === "600+") {
      priceDesc = "Over $600";
    }

    if (priceDesc) {
      titleSuffix = `${titleSuffix} | ${priceDesc}`;
    }
  }

  // Prepare description with category and size information
  let description = `Explore our curated selection of high-end men's ${formattedCategory.toLowerCase()}. Minimalist designs crafted with precision and quality.`;

  if (sizes) {
    const sizeNames = sizes.split(",").join(", ");
    description = `${description} Available in sizes ${sizeNames}.`;
  }

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
          name: `${formattedCategory} Collection`,
          description: description,
          url: `${
            process.env.BASE_URL || "https://yourwebsite.com"
          }/shop/${category}`,
          category: `Apparel & Accessories > Clothing > Men's Fashion > ${formattedCategory}`,
          image: "/images/og-category.jpg",
          offers: {
            "@type": "AggregateOffer",
            priceCurrency: "USD",
            availability: "https://schema.org/InStock",
          },
        },
      },
    ],
  };

  const collectionSchema: StructuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${formattedCategory} Collection`,
    description: description,
    url: `${
      process.env.BASE_URL || "https://yourwebsite.com"
    }/shop/${category}`,
    mainEntity: {
      "@type": "ItemList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          url: `${
            process.env.BASE_URL || "https://yourwebsite.com"
          }/shop/${category}`,
        },
      ],
    },
    specialty: "Premium Men's Fashion",
    about: {
      "@type": "Thing",
      name: `Men's ${formattedCategory}`,
      description: `High-quality, minimalist men's ${formattedCategory.toLowerCase()} designs from exclusive fashion brands.`,
    },
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
        name: formattedCategory,
        item: `${
          process.env.BASE_URL || "https://yourwebsite.com"
        }/shop/${category}`,
      },
    ],
  };

  // Return the metadata object
  return {
    title: titleSuffix,
    description: description,
    keywords: `premium men's ${formattedCategory.toLowerCase()}, designer ${formattedCategory.toLowerCase()}, minimalist fashion, high-end apparel, exclusive brands`,
    openGraph: {
      title: titleSuffix,
      description: description,
      type: "website",
      locale: "en_US",
      images: [
        {
          url: "/images/og-category.jpg",
          width: 1200,
          height: 630,
          alt: `Premium men's ${formattedCategory.toLowerCase()} collection`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: titleSuffix,
      description: description,
      images: ["/images/og-category.jpg"],
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
      canonical: `/shop/${category}${
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
      "json-ld": JSON.stringify([
        itemListSchema,
        collectionSchema,
        breadcrumbSchema,
      ]),
    },
  };
}

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
  searchParams: {
    sizes?: string;
    view?: string;
    price?: string;
  };
}) => {
  const category = params.category;
  const { sizes, view, price } = searchParams;
  const sizesArray = sizes ? sizes.split(",") : [];
  const priceRanges = price ? price.split(",") : [];
  const capitalized = category.charAt(0).toUpperCase() + category.slice(1);

  const response = await fetch(`${process.env.BASE_URL}/api/fetchProducts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
    },
    body: JSON.stringify({
      productQuery: productQuery({
        category: capitalized,
        sizes: sizesArray,
        priceRanges: priceRanges,
      }),
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
