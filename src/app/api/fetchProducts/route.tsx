// pages/api/fetchProducts.ts
import { shopifyClient } from "@/lib/shopify";
import { NextResponse } from "next/server";

export interface Variant {
  variantId: string;
  variantTitle: string;
  variantPrice: string;
  variantCurrencyCode: string;
  variantQuantityAvailable: number;
}

export interface Image {
  src: string;
  altText: string;
}

export interface Product {
  id: string;
  title: string;
  description: string;
  handle: string;
  variants: Variant[];
  images: Image[]; // Add this line
}

interface ShopifyResponse {
  products: {
    edges: {
      node: {
        id: string;
        title: string;
        description: string;
        handle: string;
        variants: {
          edges: {
            node: {
              id: string;
              title: string;
              quantityAvailable: number;
              price: {
                amount: string;
                currencyCode: string;
              };
            };
          }[];
        };
        images: {
          // Add this block
          edges: {
            node: {
              src: string;
              altText: string | null;
            };
          }[];
        };
      };
    }[];
  };
}

export async function POST(req: Request) {
  const body = await req.json();
  const { productQuery } = body;

  if (!productQuery) {
    return NextResponse.json({ error: "Missing required fields" });
  }

  try {
    const response = await shopifyClient.request<ShopifyResponse>(productQuery);

    if (!response.data || response.errors) {
      return NextResponse.json({ error: "Error fetching products" });
    }

    const products: Product[] = response.data.products.edges.map(({ node }) => {
      const { id, title, description, handle, variants, images } = node;
      const flattenedVariants: Variant[] = variants.edges.map(
        ({ node: variant }) => ({
          variantId: variant.id,
          variantTitle: variant.title,
          variantPrice: variant.price.amount,
          variantCurrencyCode: variant.price.currencyCode,
          variantQuantityAvailable: variant.quantityAvailable,
        })
      );
      const flattenedImages: Image[] = images.edges.map(({ node: image }) => ({
        src: image.src,
        altText: image.altText || "", // Handle null altText
      }));
      return {
        id,
        title,
        description,
        handle,
        variants: flattenedVariants,
        images: flattenedImages, // Add this line
      };
    });

    return NextResponse.json({ products });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json({ error: "Error fetching products" });
  }
}
