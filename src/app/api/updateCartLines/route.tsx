// /app/api/cartLinesUpdate/route.js

import { NextRequest, NextResponse } from "next/server";

// Add a middleware to log all requests
export async function middleware(req: NextRequest) {
  console.log("Middleware for updateCartLines called", {
    url: req.url,
    method: req.method,
  });
  return NextResponse.next();
}

export async function POST(req: NextRequest) {
  try {
    console.log("updateCartLines POST handler called", {
      url: req.url,
      method: req.method,
    });

    const body = await req.json();
    console.log("updateCartLines API received request:", body);

    let { cartId, lines } = body;

    // Don't strip query parameters - they're needed for Shopify
    // if (cartId && cartId.includes("?")) {
    //   cartId = cartId.split("?")[0];
    //   console.log("Normalized cart ID:", cartId);
    // }

    // Ensure cart ID has the proper Shopify format
    if (cartId && !cartId.startsWith("gid://shopify/Cart/")) {
      cartId = `gid://shopify/Cart/${cartId}`;
      console.log("Formatted cart ID for Shopify:", cartId);
    }

    const mutation = `
      mutation cartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
        cartLinesUpdate(cartId: $cartId, lines: $lines) {
          cart {
            id
            cost {
              subtotalAmount {
                amount
                currencyCode
              }
              totalAmount {
                amount
                currencyCode
              }
            }
            lines(first: 100) {
              edges {
                node {
                  id
                  quantity
                  merchandise {
                    ... on ProductVariant {
                      id
                      title
                      price {
                        amount
                        currencyCode
                      }
                      product {
                        id
                        title
                        handle
                        vendor
                        images(first: 1) {
                          edges {
                            node {
                              src: url
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
          userErrors {
            field
            message
          }
        }
      }
    `;

    const variables = {
      cartId,
      lines,
    };

    const apiUrl =
      process.env.SHOPIFY_STOREFRONT_API_URL + "/api/2024-07/graphql.json";
    if (!apiUrl) {
      throw new Error("SHOPIFY_STOREFRONT_API_URL is not defined");
    }

    const token = process.env.SHOPIFY_STOREFRONT_API_TOKEN;
    if (!token) {
      throw new Error("SHOPIFY_STOREFRONT_API_TOKEN is not defined");
    }

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": token,
      },
      body: JSON.stringify({ query: mutation, variables }),
    });

    const responseData = await response.json();

    // Extract user errors if they exist
    const userErrors = responseData.data?.cartLinesUpdate?.userErrors || [];

    // Check if any errors are about cart not existing
    const cartNotFound = userErrors.some((err: { message: string }) =>
      err.message.includes("cart does not exist")
    );

    if (
      responseData.data &&
      responseData.data.cartLinesUpdate &&
      responseData.data.cartLinesUpdate.cart
    ) {
      console.log("Successfully updated cart lines");
      // Include userErrors in the response even when successful
      return NextResponse.json({
        cart: responseData.data.cartLinesUpdate.cart,
        userErrors: userErrors,
      });
    } else if (cartNotFound) {
      // Cart not found case, return 404
      return NextResponse.json(
        {
          error: "Cart not found",
          details: responseData,
          userErrors: userErrors,
        },
        { status: 404 }
      );
    } else {
      console.error("Failed to update cart lines:", responseData);
      return NextResponse.json(
        {
          error: "Failed to update cart lines",
          details: responseData,
          userErrors: userErrors,
        },
        { status: 500 }
      );
    }
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to update cart lines", details: error.message },
      { status: 500 }
    );
  }
}
