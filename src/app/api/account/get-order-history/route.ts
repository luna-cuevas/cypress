import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

// Add shopifyFetch utility
import { shopifyFetch } from "@/utils/fetch";

export async function GET(request: Request) {
  // Parse the URL to get the userId query parameter
  const url = new URL(request.url);
  const userId = url.searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ error: "Missing user ID" }, { status: 400 });
  }

  console.log("userId", userId);

  try {
    // Create a Supabase client with admin privileges for the server
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL as string,
      process.env.SUPABASE_SERVICE_ROLE_KEY as string // Use service role key for admin operations
    );

    // Fetch the user's orders
    const { data: orders, error } = await supabase
      .from("orders")
      .select(
        `
        *,
        order_items (*)
      `
      )
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(25);

    if (error) {
      console.error("Error fetching orders:", error);
      return NextResponse.json(
        { error: "Failed to fetch order history" },
        { status: 500 }
      );
    }

    // Check if we have orders to process
    if (orders && orders.length > 0) {
      // Enhance order items with Shopify product images if needed
      for (const order of orders) {
        if (order.order_items && order.order_items.length > 0) {
          // Process each order item to ensure it has product images
          for (const item of order.order_items) {
            // If image_url is missing, fetch from Shopify
            if (!item.image_url) {
              await enhanceOrderItemWithShopifyData(item);
            }
          }
        }
      }
    }

    return NextResponse.json({ orders });
  } catch (error) {
    console.error("Error in get-order-history API route:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Helper function to fetch product data from Shopify and update the order item
async function enhanceOrderItemWithShopifyData(orderItem: any) {
  try {
    // Search for the product by title
    const productQuery = `
      query GetProductByTitle($query: String!) {
        products(first: 1, query: $query) {
          edges {
            node {
              id
              title
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

    // Use the product title to find the matching product
    // Format the query to be more specific and accurate
    const searchQuery = `title:"${orderItem.title.replace(
      /"/g,
      '\\"'
    )}" OR title:"${orderItem.title.replace(/"/g, '\\"')}*"`;

    const variables = { query: searchQuery };

    // Fetch product data from Shopify
    const productData = await shopifyFetch({
      query: productQuery,
      variables,
      cache: "no-store",
    });

    // Update the order item with product image if available
    if (
      productData?.products?.edges?.length > 0 &&
      productData.products.edges[0].node.images?.edges?.length > 0
    ) {
      const product = productData.products.edges[0].node;
      const image = product.images.edges[0].node;

      // Update the order item with the image URL and alt text
      orderItem.image_url = image.src;
      orderItem.image_alt = image.altText || orderItem.title;

      console.log(`Updated image for ${orderItem.title}`);
    } else {
      console.log(`No product found for ${orderItem.title}`);
    }
  } catch (error) {
    console.error("Error fetching product data from Shopify:", error);
    // Don't throw the error, just log it and continue
  }
}
