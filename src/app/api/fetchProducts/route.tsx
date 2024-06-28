// pages/api/fetchProducts.ts
import { shopifyClient } from "@/lib/shopify";
import { revalidatePath } from "next/cache";
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
        productType: string;
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
  product: {
    id: string;
    title: string;
    description: string;
    handle: string;
    productType: string;
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
}

const optimizeImage = (
  src: string,
  width: number,
  height: number,
  format = "webp",
  quality = 40, // Default quality set to 80
  scale = 1 // Default scale set to 1
) => {
  return `${src}?width=${width}&height=${height}&format=${format}&quality=${quality}&scale=${scale}`;
};

export async function POST(req: Request) {
  revalidatePath(req.url);

  const body = await req.json();
  const { productQuery } = body;

  if (!productQuery) {
    return NextResponse.json({ error: "Missing required fields" });
  }

  try {
    const response = await shopifyClient.request<ShopifyResponse>(productQuery);

    if (!response.data || response.errors) {
      return NextResponse.json({ error: response.errors, data: response.data });
    }

    if (response.data.products) {
      const products: Product[] = response.data.products.edges.map(
        ({ node }) => {
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
          const flattenedImages: Image[] = images.edges.map(
            ({ node: image }) => ({
              src: image.src,
              altText: image.altText || "", // Handle null altText
            })
          );
          return {
            id,
            title,
            description,
            handle,
            productType: node.productType || "", // Handle null productType
            variants: flattenedVariants,
            images: flattenedImages, // Add this line
          };
        }
      );

      // Optimize images
      const optimizedProducts = products.map((product) => ({
        ...product,
        images: product.images.map((image) => ({
          ...image,
          src: optimizeImage(image.src, 800, 800), // Adjust width and height as needed
        })),
      }));

      return NextResponse.json({ products: optimizedProducts });
    } else if (response.data.product) {
      const { id, title, description, handle, variants, images } =
        response.data.product;
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
      return NextResponse.json({
        product: {
          id,
          title,
          description,
          handle,
          productType: response.data.product.productType || "", // Handle null productType
          variants: flattenedVariants,
          images: flattenedImages, // Add this line
        },
      });
    }
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json({
      error: error,
      details: "Error fetching products",
    });
  }
}
