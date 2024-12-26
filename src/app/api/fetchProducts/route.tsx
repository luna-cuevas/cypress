import { shopifyFetch } from "@/utils/fetch";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { productQuery } = await request.json();
    let fullResponse;

    // First fetch to get the product and its vendor
    const productResponse = await shopifyFetch({
      query: productQuery,
      cache: "no-store",
    });

    if (productResponse.product) {
      // Replace vendor placeholder in the query
      const queryWithVendor = productQuery.replace(
        "$vendor",
        productResponse.product.vendor
      );

      // Second fetch with the vendor-specific query
      fullResponse = await shopifyFetch({
        query: queryWithVendor,
        cache: "no-store",
      });

      const transformedProduct = {
        ...fullResponse.product,
        variants:
          fullResponse.product.variants.edges.map((edge: any) => ({
            variantId: edge.node.id,
            variantTitle: edge.node.title,
            variantPrice: edge.node.price.amount,
            variantCurrencyCode: edge.node.price.currencyCode,
            variantQuantityAvailable: edge.node.quantityAvailable,
          })) || [],
        images:
          fullResponse.product.images.edges.map((edge: any) => ({
            src: edge.node.src,
            altText: edge.node.altText || "",
          })) || [],
      };

      // Transform related products (products from same vendor)
      const relatedProducts =
        fullResponse.products?.edges.map((edge: any) => ({
          id: edge.node.id,
          title: edge.node.title,
          vendor: edge.node.vendor,
          handle: edge.node.handle,
          description: edge.node.description,
          productType: edge.node.productType,
          variants:
            edge.node.variants.edges.map((variantEdge: any) => ({
              variantPrice: variantEdge.node.price.amount,
            })) || [],
          images:
            edge.node.images.edges.map((imageEdge: any) => ({
              src: imageEdge.node.src,
              altText: imageEdge.node.altText || "",
            })) || [],
        })) || [];

      console.log("relatedProducts", relatedProducts);

      return NextResponse.json({
        product: transformedProduct,
        relatedProducts: relatedProducts.filter(
          (p: any) => p.id !== transformedProduct.id
        ),
      });
    }
    console.log("productResponse", productResponse);

    return NextResponse.json(productResponse);
  } catch (error) {
    console.error("Error in fetchProducts:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}
