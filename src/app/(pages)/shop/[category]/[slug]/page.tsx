import React, { useState } from "react";
import { productQuery } from "@/utils/productQuery";
import Image from "next/image";
import Link from "next/link";
import Carousel from "@/components/shop/Carousel";
import AddToCartButton from "@/components/shop/AddToCartButton";
import SizeSelection from "@/components/shop/SizeSelection";
import TabContent from "@/components/shop/TabContent";
import RelatedProducts from "@/components/shop/RelatedProducts";
import { Motion } from "@/utils/Motion";
import { Metadata } from "next";
import NewsletterForm from "@/components/shop/NewsletterForm";
import DesktopGalleryWithLightbox from "@/components/shop/DesktopGalleryWithLightbox";
import FavoriteButton from "@/components/shop/FavoriteButton";

type Props = {
  params: { category: string; slug: string };
  searchParams: { variantSize?: string; tab?: string };
};

// Helper function to fetch product metadata
async function fetchProductMetadata(handle: string) {
  console.log(`Fetching product metadata for product handle: ${handle}`);
  try {
    // Use both handle and product params for compatibility with API
    const res = await fetch(
      `${process.env.BASE_URL}/api/product-metadata?handle=${handle}&product=${handle}`,
      { cache: "no-store" }
    );
    if (!res.ok) {
      console.error(
        `Error response from metadata API: ${res.status} ${res.statusText}`
      );
      console.log(
        "API URL used:",
        `${process.env.BASE_URL}/api/product-metadata?handle=${handle}&product=${handle}`
      );
      throw new Error(`Error fetching product metadata: ${res.statusText}`);
    }
    const data = await res.json();

    // Check for metadata in the response (new API format returns metadata directly)
    const metadata = data.metadata || {};
    const metafields = metadata.metafields || [];

    // Count resolved references for debugging
    let resolvedCount = 0;
    let metaobjectCount = 0;

    // Check metafields for resolved references
    if (Array.isArray(metafields)) {
      metafields.forEach((mf: any) => {
        if (mf && mf.type?.includes("reference") && mf.reference) {
          resolvedCount++;
        }
      });
    }

    // Check metafieldMap for resolved references
    if (metadata.metafieldMap) {
      metaobjectCount = Object.keys(metadata.metafieldMap).length;
      Object.values(metadata.metafieldMap).forEach((mf: any) => {
        if (mf && (mf.resolvedList || mf.directlyResolvedReference)) {
          resolvedCount++;
        }
      });
    }

    console.log(
      `Metadata API: Fetched product metadata with ${metaobjectCount} metaobject references, ${resolvedCount} resolved`
    );

    return data;
  } catch (error) {
    console.error("Error fetching product metadata:", error);
    return { metadata: null };
  }
}

// Helper function to fetch metafields
async function fetchProductMetafields(id: string) {
  console.log(`Fetching product metafields for product ID: ${id}`);
  try {
    // Use both product and id params for compatibility
    const res = await fetch(
      `${
        process.env.BASE_URL
      }/api/product-metafields?id=${id}&product=${id.replace(
        "gid://shopify/Product/",
        ""
      )}`,
      { cache: "no-store" }
    );

    if (!res.ok) {
      console.error(
        `Error response from metafields API: ${res.status} ${res.statusText}`
      );
      console.log(
        "API URL used:",
        `${
          process.env.BASE_URL
        }/api/product-metafields?id=${id}&product=${id.replace(
          "gid://shopify/Product/",
          ""
        )}`
      );
      throw new Error(`Error fetching product metafields: ${res.statusText}`);
    }

    const data = await res.json();

    // Check for error in the response
    if (data.error) {
      console.error("API returned an error:", data.error);
      return {
        metafields: {},
        metafieldsList: [],
        _debug: { error: data.error },
      };
    }

    // The metafields API returns either a metafields object grouped by namespace
    // or a flat array in metafieldsList - handle both formats
    const metafieldsArr = data.metafieldsList || [];
    const metafieldsObj = data.metafields || {};

    // Convert object structure to array if needed
    let flatMetafields = metafieldsArr.length > 0 ? metafieldsArr : [];

    // If we have the object structure but no array, flatten it
    if (flatMetafields.length === 0 && Object.keys(metafieldsObj).length > 0) {
      Object.entries(metafieldsObj).forEach(
        ([namespace, fields]: [string, any]) => {
          Object.entries(fields).forEach(([key, field]: [string, any]) => {
            flatMetafields.push({
              namespace,
              key,
              ...field,
            });
          });
        }
      );
    }

    // Log information about resolved metaobject references
    const resolvedRefs = flatMetafields.filter(
      (mf: any) =>
        (mf.resolvedList && mf.resolvedList.length > 0) ||
        mf.directlyResolvedReference ||
        (mf.value &&
          typeof mf.value === "object" &&
          !Array.isArray(mf.value) &&
          mf.value.type)
    );

    const _debug = data._debug || {
      timestamp: new Date().toISOString(),
      apiVersion: "2024-07",
      resolvedCount: resolvedRefs.length,
      totalCount: flatMetafields.length,
    };

    console.log(
      `Metafields API: Fetched ${flatMetafields.length} metafields with ${resolvedRefs.length} resolved references`
    );

    // Make sure we always return both formats for compatibility
    return {
      ...data,
      metafields: data.metafields || {},
      metafieldsList: flatMetafields,
      _debug,
      _resolvedMetaobjects: {
        count: resolvedRefs.length,
        total: flatMetafields.length,
      },
    };
  } catch (error) {
    console.error("Error fetching product metafields:", error);
    return {
      metafields: {},
      metafieldsList: [],
      _debug: {
        error: String(error),
        timestamp: new Date().toISOString(),
      },
    };
  }
}

// Create a human-readable mapping for metafields with references
function createMetafieldHumanReadable(metafields: any[]) {
  const humanReadable: Record<string, any> = {};

  for (const mf of metafields) {
    if (!mf) continue;

    const key = `${mf.namespace}--${mf.key}`;

    // Handle metaobject references
    if (mf.type?.includes("reference") && mf.reference) {
      humanReadable[key] = mf.reference;
      continue;
    }

    // Store all other values as-is
    if (mf.value) {
      try {
        // Try to parse JSON values
        if (mf.type?.includes("json")) {
          humanReadable[key] = JSON.parse(mf.value);
        } else {
          humanReadable[key] = mf.value;
        }
      } catch (e) {
        humanReadable[key] = mf.value;
      }
    }
  }

  return humanReadable;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, category } = params;
  try {
    // Fetch metadata from our new endpoint
    const metadata = await fetchProductMetadata(slug);
    const metadataContent = metadata?.metadata || metadata;

    if (!metadata || !metadataContent) {
      // Fallback to the existing method if our new endpoint fails
      const response = await fetch(
        `${process.env.BASE_URL}/api/fetchProducts`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            productQuery: productQuery({ handle: slug }),
          }),
        }
      );

      const data = await response.json();
      const product = data?.product;

      if (!product) {
        return {
          title: "Product Not Found",
          description: "The requested product could not be found",
        };
      }

      return {
        title: product.title,
        description: product.description || "Product details",
        openGraph: {
          title: product.title,
          description: product.description || "Product details",
          images:
            product.images?.map((image: { src: string; altText: string }) => ({
              url: image.src,
              alt: image.altText || product.title,
            })) || [],
          type: "website",
        },
      };
    }

    // Get the metafields for SEO data
    const metafields = metadataContent.metafields || [];
    const metafieldMap = metadataContent.metafieldMap || {};

    // Extract SEO metadata from metafields if available
    const seoTitle = getSeoValue(metafields, metafieldMap, "seo", "title");
    const seoDescription = getSeoValue(
      metafields,
      metafieldMap,
      "seo",
      "description"
    );
    const seoKeywords = getSeoValue(
      metafields,
      metafieldMap,
      "seo",
      "keywords"
    );

    // Get product data for structured data
    const productTitle =
      seoTitle || metadataContent.seo?.title || metadataContent.title;
    const productDescription =
      seoDescription ||
      metadataContent.seo?.description ||
      metadataContent.description ||
      "Premium men's fashion item. Minimalist design crafted with quality materials.";

    // Build image array for OpenGraph and Twitter
    const images =
      metadataContent.images?.edges?.map((edge: any) => ({
        url: edge.node.src,
        alt: edge.node.altText || metadataContent.title,
      })) ||
      (metadataContent.featuredImage
        ? [
            {
              url:
                metadataContent.featuredImage.url ||
                metadataContent.featuredImage.src,
              alt:
                metadataContent.featuredImage.altText || metadataContent.title,
            },
          ]
        : []);

    // Extract product details for structured data
    const price = metadataContent.priceRange?.minVariantPrice?.amount;
    const currency =
      metadataContent.priceRange?.minVariantPrice?.currencyCode || "USD";
    const availability = metadataContent.availableForSale
      ? "https://schema.org/InStock"
      : "https://schema.org/OutOfStock";
    const brand =
      metadataContent.vendor ||
      getSeoValue(metafields, metafieldMap, "product", "vendor");

    // Format category for display
    const formattedCategory =
      category.charAt(0).toUpperCase() + category.slice(1).replace(/-/g, " ");

    // Create structured data for rich results
    const productSchema = {
      "@context": "https://schema.org",
      "@type": "Product",
      name: productTitle,
      description: productDescription,
      image: images.length > 0 ? images[0].url : undefined,
      offers: {
        "@type": "Offer",
        price: price,
        priceCurrency: currency,
        availability: availability,
        url: `${
          process.env.BASE_URL || "https://yourwebsite.com"
        }/shop/${category}/${slug}`,
      },
      brand: {
        "@type": "Brand",
        name: brand || "Premium Menswear",
      },
      category: `Apparel & Accessories > Clothing > Men's Fashion > ${formattedCategory}`,
      sku: metadataContent.sku || slug,
      material:
        getSeoValue(metafields, metafieldMap, "shopify", "fabric") ||
        getSeoValue(metafields, metafieldMap, "product", "material"),
      color: getSeoValue(metafields, metafieldMap, "shopify", "color"),
    };

    const breadcrumbSchema = {
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
        {
          "@type": "ListItem",
          position: 4,
          name: productTitle,
          item: `${
            process.env.BASE_URL || "https://yourwebsite.com"
          }/shop/${category}/${slug}`,
        },
      ],
    };

    // Build structured metadata for better SEO
    return {
      title: `${productTitle} | Premium Men's Fashion`,
      description: productDescription,
      keywords:
        seoKeywords ||
        metadataContent.tags ||
        metadataContent.keywords ||
        `premium menswear, ${
          brand || ""
        } ${formattedCategory.toLowerCase()}, minimalist fashion, high-end apparel`,
      openGraph: {
        title: productTitle,
        description: productDescription,
        images: images,
        type: "website",
        locale: "en_US",
        siteName: "Cypress",
      },
      twitter: {
        card: "summary_large_image",
        title: productTitle,
        description: productDescription,
        images: images.length > 0 ? [images[0].url] : undefined,
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
      // Include canonical URL if available
      alternates: {
        canonical: `${
          process.env.BASE_URL || "https://yourwebsite.com"
        }/shop/${category}/${slug}`,
      },
      // Add structured data for product
      other: {
        "og:price:amount": price || "",
        "og:price:currency": currency,
        "og:availability": availability.replace("https://schema.org/", ""),
        "product:price:amount": price || "",
        "product:price:currency": currency,
        "product:availability": availability.replace("https://schema.org/", ""),
        "product:brand": brand || "Premium Menswear",
        "product:category": formattedCategory,
        "product:condition": "new",
        "json-ld": JSON.stringify([productSchema, breadcrumbSchema]),
      },
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: "Product Page | Premium Men's Fashion",
      description:
        "View our premium men's fashion product details. Minimalist design crafted with quality materials.",
    };
  }
}

// Helper function to extract SEO values from metafields
function getSeoValue(
  metafields: any[],
  metafieldMap: any,
  namespace: string,
  key: string
): string | undefined {
  // Try to find in metafieldMap first (new format)
  const mapKey = `${namespace}--${key}`;
  if (metafieldMap[mapKey]) {
    return metafieldMap[mapKey].value;
  }

  // Then look in metafields array
  const metafield = metafields.find(
    (mf: any) => mf && mf.namespace === namespace && mf.key === key
  );

  return metafield?.value;
}

export default async function ProductPage({ params, searchParams }: Props) {
  const { slug } = params;
  const variantSize = searchParams.variantSize;
  const selectedTab = searchParams.tab || "description"; // Default to description if no tab is specified
  console.log(`📝 Rendering product page for: ${slug}`);

  try {
    // Fetch product data
    const response = await fetch(`${process.env.BASE_URL}/api/fetchProducts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
      body: JSON.stringify({
        productQuery: productQuery({ handle: slug }),
      }),
    });

    const data = await response.json();
    const product = data?.product;

    if (!product) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[50vh] text-center p-4">
          <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
          <p className="mb-6">
            The product you&apos;re looking for could not be found.
          </p>
          <Link href="/shop" className="text-cypress-green hover:underline">
            Return to Shop
          </Link>
        </div>
      );
    }

    // Fetch metafields using our existing API endpoint
    const metafieldsData = await fetchProductMetafields(product.id);

    // Fetch enhanced metadata using our new API endpoint
    const metadata = await fetchProductMetadata(slug);

    // Log for debugging
    console.log("product", product);

    // Enhance the product object with both metafields and metadata
    const enhancedProduct = {
      ...product,
      // Maintain backward compatibility with both names
      metafields: metafieldsData?.metafieldsList || [],
      adminMetafields: metafieldsData?.metafields || {},
      metadata: metadata || {},
      // Add organized metafields for backward compatibility
      organizedMetafields:
        metadata?.organizedMetafields ||
        extractOrganizedMetafields(metafieldsData),
      // Add resolved references info for debugging
      _debug: {
        metafieldsResolved: metafieldsData?._resolvedMetaobjects?.count || 0,
        metadataResolved: metadata?.metaobjectAccess?.resolvedCount || 0,
        resolvedMetadataCount: metadata?.metafieldMap
          ? Object.values(metadata.metafieldMap).filter(
              (mf: any) =>
                mf && (mf.resolvedList || mf.directlyResolvedReference)
            ).length
          : 0,
        resolvedMetafieldsCount: (metafieldsData?.metafieldsList || []).filter(
          (mf: any) =>
            (mf.resolvedList && mf.resolvedList.length > 0) ||
            mf.directlyResolvedReference
        ).length,
        metadataNamespaces: metadata?.metafields
          ? Array.from(
              new Set(
                metadata.metafields
                  .filter((m: any) => m)
                  .map((m: any) => m.namespace)
              )
            )
          : [],
        metafieldsNamespaces: Array.from(
          new Set(
            (metafieldsData?.metafieldsList || []).map((m: any) => m.namespace)
          )
        ),
        apiVersion: "2024-07",
        timestamp: new Date().toISOString(),
      },
    };

    console.log(
      `🔄 Created enhanced product with resolved metaobjects:`,
      enhancedProduct._debug
    );

    const selectedVariant = product.variants?.find(
      (variant: any) => variant.variantTitle === variantSize
    );

    const pathSegments = ["shop", params.category, slug];

    return (
      <div className="z-0 relative min-h-[calc(100vh-70px)] bg-white dark:bg-black">
        <div className="">
          <Motion
            type="div"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            viewport={{ once: false, amount: 0.15 }}
            transition={{
              duration: 0.5,
              delay: 0.1,
            }}
            className=" ">
            <nav
              aria-label="Breadcrumb"
              className="md:pt-4 md:pb-0 py-2 pl-2 lg:w-full ">
              <ol role="list" className="flex max-w-2xl items-center space-x-1">
                <li className="flex items-center">
                  <Link
                    href={`/`}
                    className="font-medium text-xs text-gray-500 dark:text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                    Home
                  </Link>
                </li>
                {pathSegments.map((segment, index) => {
                  const href = "/" + pathSegments.slice(0, index + 1).join("/");
                  const isLast = index === pathSegments.length - 1;

                  return (
                    <li key={segment} className="flex items-center capitalize">
                      <svg
                        width={16}
                        height={20}
                        viewBox="0 0 16 20"
                        fill="currentColor"
                        aria-hidden="true"
                        className="h-5 w-4 mr-0 text-gray-300">
                        <path d="M5.697 4.34L8.98 16.532h1.327L7.025 4.341H5.697z" />
                      </svg>
                      <Link
                        href={href}
                        aria-current={
                          index === pathSegments.length - 1 ? "page" : undefined
                        }
                        className={
                          isLast
                            ? "font-bold text-xs text-gray-900 dark:text-white"
                            : "font-medium text-xs text-gray-500 dark:text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                        }>
                        {segment}
                      </Link>
                    </li>
                  );
                })}
              </ol>
            </nav>

            <div className="w-full h-full flex md:flex-row flex-col max-w-[1600px] px-0 mx-auto justify-between">
              {/* Desktop Image Gallery with Lightbox */}
              <div className="hidden h-full relative gap-2 md:w-[50%] lg:w-[55%] md:flex ">
                <DesktopGalleryWithLightbox images={product.images} />
              </div>

              {/* Mobile Carousel */}
              <div className="md:hidden flex h-[70vh]">
                <Carousel slides={product.images} />
              </div>

              <Motion
                type="div"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 50 }}
                viewport={{ once: false, amount: 0.15 }}
                transition={{
                  duration: 0.5,
                  delay: 0.5,
                }}
                className="relative block h-auto md:w-[50%] lg:w-[45%] pl-4 pr-4 bg-white dark:bg-black">
                {/* Product info */}
                <div className="m-auto md:sticky right-0 top-0 pt-4 left-0 max-w-2xl   ">
                  <div className="lg:col-span-2 mb-2 lg:pr-8">
                    <h1 className="text-2xl text-gray-900 dark:text-white sm:text-2xl">
                      {product.title}
                    </h1>
                    <div className="flex items-center gap-4 mt-2">
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {product.vendor}
                      </span>
                    </div>
                  </div>

                  {/* Options */}
                  <div className="mt-4 lg:row-span-3 lg:mt-0">
                    <h2 className="sr-only">Product information</h2>
                    <p className="text-xl tracking-tight text-gray-600 dark:text-gray-400">
                      $
                      {(
                        selectedVariant?.variantPrice ||
                        product.variants[0].variantPrice
                      )
                        .replace(".00", "")
                        .replace(".0", "")}
                    </p>

                    <div className="flex flex-col gap-8 my-8">
                      {/* Sizes */}
                      <div className="">
                        <div className="flex items-center justify-between">
                          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
                            {selectedVariant?.variantTitle ? (
                              <span className="gap-1 flex">
                                Size
                                <span className="text-black dark:text-white">
                                  {selectedVariant.variantTitle}
                                </span>
                              </span>
                            ) : (
                              "Select Size"
                            )}
                          </h3>
                          <Link
                            href="#"
                            className="text-sm underline font-medium text-gray-800 dark:text-gray-400 hover:text-cypress-green dark:hover:text-cypress-green-light">
                            Size guide
                          </Link>
                        </div>

                        <SizeSelection
                          selectedVariant={selectedVariant}
                          product={product}
                        />
                      </div>

                      <div className="flex gap-2 items-center">
                        <AddToCartButton
                          product={product}
                          selectedVariant={selectedVariant}
                        />
                        <FavoriteButton
                          productId={product.id}
                          productTitle={product.title}
                          productImage={product.images[0]?.src || ""}
                          productPrice={
                            selectedVariant?.variantPrice ||
                            product.variants[0].variantPrice
                          }
                          productHandle={product.handle}
                        />
                      </div>
                    </div>
                  </div>

                  <div className=" lg:col-span-2 lg:col-start-1 mb-4 lg:border-gray-200 ">
                    {/* Tabs */}
                    <TabContent
                      product={enhancedProduct}
                      selectedTab={selectedTab}
                      preserveParams={searchParams}
                    />
                  </div>
                </div>
              </Motion>
            </div>

            {/* Related Products */}
            <div className="my-12 py-8 relative border-t border-gray-200 dark:border-gray-800">
              <RelatedProducts relatedProducts={data.relatedProducts} />
            </div>

            {/* Reviews Section */}
            {/* <div className="my-12 py-8 relative border-t border-gray-200 dark:border-gray-800">
              <ProductReviews productId={product.id} />
            </div> */}

            {/* Newsletter Section */}
            <div className="my-12 py-8  relative border-t border-gray-200 dark:border-gray-800">
              <NewsletterForm />
            </div>
          </Motion>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error fetching product:", error);
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center p-4">
        <h1 className="text-2xl font-bold mb-4">Error</h1>
        <p className="mb-6">An error occurred while fetching the product.</p>
        <Link href="/shop" className="text-cypress-green hover:underline">
          Return to Shop
        </Link>
      </div>
    );
  }
}

// Helper function to extract organized metafields
function extractOrganizedMetafields(metafieldsData: any) {
  const organizedMetafields: any = {
    fabric: null,
    color: null,
    colorPattern: null,
    size: null,
    fit: null,
    targetGender: null,
    ageGroup: null,
    sleeveLength: null,
    topLength: null,
    neckline: null,
    pantsLength: null,
    accessorySize: null,
    topLengthType: null,
  };

  // Multiple possible sources for metafield data
  const metafieldsObj = metafieldsData?.metafields || {};
  const metafieldsList = metafieldsData?.metafieldsList || [];
  const metafieldMap = metafieldsData?.metafieldMap || {};

  // Function to find a metafield by namespace and key
  const findMetafield = (namespace: string, key: string) => {
    // First try from the new metafieldMap format (from product-metadata API)
    if (metafieldMap[`${namespace}--${key}`]) {
      return metafieldMap[`${namespace}--${key}`];
    }

    // Then try from the object structure
    if (metafieldsObj[namespace] && metafieldsObj[namespace][key]) {
      return metafieldsObj[namespace][key];
    }

    // Then try from the array
    return metafieldsList.find(
      (mf: any) => mf && mf.namespace === namespace && mf.key === key
    );
  };

  // Map common metafields
  organizedMetafields.fabric = findMetafield("shopify", "fabric");
  organizedMetafields.color = findMetafield("shopify", "color");
  organizedMetafields.colorPattern = findMetafield("shopify", "color-pattern");
  organizedMetafields.size = findMetafield("shopify", "size");
  organizedMetafields.fit = findMetafield("shopify", "fit");
  organizedMetafields.targetGender = findMetafield("shopify", "target-gender");
  organizedMetafields.ageGroup = findMetafield("shopify", "age-group");
  organizedMetafields.sleeveLength = findMetafield(
    "shopify",
    "sleeve-length-type"
  );
  organizedMetafields.topLength = findMetafield("shopify", "top-length-type");
  organizedMetafields.topLengthType = findMetafield(
    "shopify",
    "top-length-type"
  );
  organizedMetafields.neckline = findMetafield("shopify", "neckline");
  organizedMetafields.pantsLength = findMetafield(
    "shopify",
    "pants-length-type"
  );
  organizedMetafields.accessorySize = findMetafield(
    "shopify",
    "accessory-size"
  );

  return organizedMetafields;
}
