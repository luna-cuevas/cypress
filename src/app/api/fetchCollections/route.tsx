// app/api/fetchCollections/route.ts
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
  productType: string;
  tags: string[];
  variants: Variant[];
  images: Image[];
}

export interface Collection {
  id: string;
  title: string;
  description: string;
  handle: string;
  image: Image;
  products: Product[];
}

export async function GET() {
  const query = `
    {
      collections(first: 20) {
        edges {
          node {
            id
            title
            description
            handle
            image {
              originalSrc
              altText
            }
            products(first: 10) {
              edges {
                node {
                  id
                  title
                  description
                  handle
                  productType
                  tags
                  variants(first: 10) {
                    edges {
                      node {
                        id
                        title
                        quantityAvailable
                        price {
                          amount
                          currencyCode
                        }
                      }
                    }
                  }
                  images(first: 1) {
                    edges {
                      node {
                        src
                        altText
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  `;

  try {
    const response = await shopifyClient.request(query);

    if (response.data.collections.edges) {
      const collections: Collection[] = response.data.collections.edges.map(
        (edge: any) => {
          const { id, title, description, handle, image, products } = edge.node;

          const flatProducts: Product[] = products.edges.map(
            (productEdge: any) => {
              const productNode = productEdge.node;

              const flatVariants: Variant[] = productNode.variants.edges.map(
                (variantEdge: any) => ({
                  variantId: variantEdge.node.id,
                  variantTitle: variantEdge.node.title,
                  variantPrice: variantEdge.node.price.amount,
                  variantCurrencyCode: variantEdge.node.price.currencyCode,
                  variantQuantityAvailable: variantEdge.node.quantityAvailable,
                })
              );

              const flatImages: Image[] = productNode.images.edges.map(
                (imageEdge: any) => ({
                  src: imageEdge.node.src,
                  altText: imageEdge.node.altText || "",
                })
              );

              return {
                id: productNode.id,
                title: productNode.title,
                description: productNode.description,
                handle: productNode.handle,
                productType: productNode.productType,
                tags: productNode.tags,
                variants: flatVariants,
                images: flatImages,
              };
            }
          );

          return {
            id,
            title,
            description,
            handle,
            image: {
              src: image?.originalSrc || "",
              altText: image?.altText || "",
            },
            products: flatProducts,
          };
        }
      );

      return NextResponse.json({ collections });
    }

    if (response.errors) {
      console.error("Error fetching collections:", response.errors);
      return NextResponse.json({ error: "Error fetching collections" });
    }
  } catch (error) {
    console.error("Error fetching collections:", error);
    return NextResponse.json({ error: "Error fetching collections" });
  }
}
