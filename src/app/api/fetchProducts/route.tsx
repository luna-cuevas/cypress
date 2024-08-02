// pages/api/fetchProducts.ts
import { shopifyClient } from "@/lib/shopify";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

import "@shopify/shopify-api/adapters/node";
import { shopifyApi, ApiVersion, Session } from "@shopify/shopify-api";
import { restResources } from "@shopify/shopify-api/rest/admin/2023-04";

const shopifyAdmin = shopifyApi({
  apiKey: `${process.env.SHOPIFY_API_KEY}`,
  apiSecretKey: `${process.env.SHOPIFY_API_SECRET}`,
  apiVersion: ApiVersion.April23,
  isCustomStoreApp: true, // this MUST be set to true (default is false)
  adminApiAccessToken: `${process.env.SHOPIFY_ADMIN_API_TOKEN}`,
  isEmbeddedApp: false,
  hostName: `${process.env.SHOPIFY_HOSTNAME}`,
  // Mount REST resources.
  restResources,
});

const session = shopifyAdmin.session.customAppSession(
  `${process.env.SHOPIFY_HOSTNAME}`
);

const adminClient = new shopifyAdmin.clients.Rest({ session });

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
  description: string;
  vendor?: string;
  title: string;
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
        vendor: string;
        price: {
          amount: string;
          currencyCode: string;
        };
        handle: string;
        productType: string;
        tags: string[];
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
    vendor: string;
    productType: string;
    tags: string[];
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
    relatedProducts: {
      edges: {
        node: {
          id: string;
          description: string;
          handle: string;
          title: string;
          vendor: string;

          images: {
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
  };
  collectionByHandle: {
    id: string;
    title: string;
    description: string;
    products: {
      edges: {
        node: {
          id: string;
          title: string;
          description: string;
          handle: string;
          productType: string;
          tags: string[];
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
  };
}

const optimizeImage = (
  src: string,
  width: number,
  height: number,
  format = "webp",
  quality = 100, // Default quality set to 80
  scale = 1 // Default scale set to 1
) => {
  return `${src}?width=${width}&height=${height}&format=${format}&quality=${quality}&scale=${scale}&crop=center`;
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
          const { id, title, description, handle, variants, tags, images } =
            node;
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
            tags,
            productType: node.productType.toLowerCase() || "", // Handle null productType
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
          src: optimizeImage(image.src, 1000, 1000), // Adjust width and height as needed
        })),
      }));

      return NextResponse.json({ products: optimizedProducts });
    } else if (response.data.product) {
      const { id, title, description, handle, variants, images, tags, vendor } =
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

      // Fetch related products using the vendor
      const relatedProductsQuery = `
        query {
          products(first: 10, query: "vendor:${vendor}") {
            edges {
              node {
                id
                handle
                title
                vendor
                productType
                variants(first: 20) {
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
      `;

      const relatedProductsResponse =
        await shopifyClient.request<ShopifyResponse>(relatedProductsQuery);

      if (!relatedProductsResponse.data || relatedProductsResponse.errors) {
        return NextResponse.json({
          error: relatedProductsResponse.errors,
          data: relatedProductsResponse.data,
        });
      }

      const relatedProducts: Product[] =
        relatedProductsResponse.data.products.edges.map(({ node }) => {
          const { id, handle, title, vendor, images, productType } = node;
          const flattenedImages: Image[] = images.edges.map(
            ({ node: image }) => ({
              src: image.src,
              altText: image.altText || "",
            })
          );
          const flattenedVariants: Variant[] = variants.edges.map(
            ({ node: variant }) => ({
              variantId: variant.id,
              variantTitle: variant.title,
              variantPrice: variant.price.amount,
              variantCurrencyCode: variant.price.currencyCode,
              variantQuantityAvailable: variant.quantityAvailable,
            })
          );
          return {
            id,
            title,
            description,
            handle,
            productType: productType.toLowerCase() || "",
            vendor,
            variants: flattenedVariants,
            images: flattenedImages,
          };
        });

      // gid://shopify/Product/8967575732455 i want to only get the last part of the id
      const productId = id.split("/").pop();

      const metadataResponse = await shopifyAdmin.rest.Metafield.all({
        session: session,
        metafield: { owner_id: productId, owner_resource: "product" },
      });

      console.log("metafieldResponse", metadataResponse);

      const metafields = metadataResponse.data;

      const fetchMetafieldById = async (id: string) => {
        console.log("id", id);
        const metafieldResponse = await shopifyAdmin.rest.Metafield.find({
          session: session,
          product_id: productId,
          id: `${id}`,
        });

        if (!metafieldResponse) {
          console.error("Error fetching metafield");
        } else {
          return metafieldResponse;
        }
      };

      const formattedIds = metafields.map((metafield: any) => {
        const ids = JSON.parse(metafield.value);
        return ids.map((id: string) => id.split("/").pop());
      });

      console.log("formattedIds", formattedIds);

      // const metafieldResponse = await shopifyAdmin.rest.Metafield.find({
      //   session: session,
      //   product_id: productId,
      //   id: formattedIds[0],
      // });

      // console.log("metafieldResponse", metafieldResponse);

      // const processedMetafields = await Promise.all(
      //   metafields.map(async (metafield: any) => {
      //     const ids = JSON.parse(metafield.value);
      //     const formattedIds = ids.map((id: string) => id.split("/").pop());
      //     // ids.map((id: string) => id.split("/").pop());
      //     console.log("formattedIds", formattedIds);
      //     const values = await Promise.all(
      //       formattedIds.map((id: string) => fetchMetafieldById(id))
      //     );
      //     return {
      //       ...metafield,
      //       values: values.map((value: any) => value.value),
      //     };
      //   })
      // );

      // const metadata = processedMetafields.map((metafield: any) => ({
      //   id: metafield.id,
      //   key: metafield.key,
      //   namespace: metafield.namespace,
      //   value: metafield.value,
      //   values: metafield.values,
      // }));

      // console.log("metadataResponse", metadata);

      if (!metadataResponse.data) {
        return NextResponse.json({
          error: "No metadata found",
          data: metadataResponse.data,
        });
      }

      return NextResponse.json({
        product: {
          id,
          title,
          description,
          handle,
          // metadata,
          tags,
          productType: response.data.product.productType.toLowerCase() || "",
          variants: flattenedVariants,
          images: flattenedImages,
        },
        relatedProducts,
      });
    } else if (response.data.collectionByHandle) {
      const { id, title, description, products } =
        response.data.collectionByHandle;
      const collectionProducts: Product[] = products.edges.map(({ node }) => {
        const { id, title, description, handle, variants, tags, images } = node;
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
            altText: image.altText || "",
          })
        );
        return {
          id,
          title,
          description,
          handle,
          tags,
          productType: node.productType.toLowerCase() || "",
          variants: flattenedVariants,
          images: flattenedImages,
        };
      });

      const optimizedCollectionProducts = collectionProducts
        .reverse()
        .map((product) => ({
          ...product,
          images: product.images.map((image) => ({
            ...image,
            src: optimizeImage(image.src, 1000, 1000),
          })),
        }));

      return NextResponse.json({
        id,
        title,
        description,
        products: optimizedCollectionProducts,
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
