// /app/api/cartLinesAdd/route.js

import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    let { cartId, lineItems } = await req.json();

    console.log("addCartLines cartId", cartId);
    console.log("addCartLines lineItems", lineItems);

    console.log("Adding lines to cart:", cartId);

    const mutation = `
      mutation cartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
        cartLinesAdd(cartId: $cartId, lines: $lines) {
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
      lines: lineItems.map((item: any) => ({
        quantity: item.quantity,
        merchandiseId: item.variantId,
      })),
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
    console.log("Shopify response for cartLinesAdd:", responseData);

    // Extract user errors if present
    const userErrors = responseData.data?.cartLinesAdd?.userErrors || [];

    // Check if any errors are about cart not existing
    const cartNotFound = userErrors.some(
      (err: { message: string }) =>
        err.message.includes("cart does not exist") ||
        err.message.includes("does not exist")
    );

    // If we have cart not found errors, always return a 404 status
    // This is important even if Shopify returns a cart object
    if (cartNotFound) {
      console.log("Cart not found error detected in API response");
      // Cart not found - return 404 to indicate client should create a new cart
      return NextResponse.json(
        {
          error: "Cart not found",
          details: {
            data: responseData.data,
            errors: responseData.errors,
          },
          userErrors: userErrors,
        },
        { status: 404 }
      );
    }

    if (
      responseData.data &&
      responseData.data.cartLinesAdd &&
      responseData.data.cartLinesAdd.cart
    ) {
      // Success case
      return NextResponse.json({
        cart: responseData.data.cartLinesAdd.cart,
        userErrors: userErrors,
      });
    } else {
      // Other error - return 500
      return NextResponse.json(
        {
          error: "Failed to add items to cart",
          details: {
            data: responseData.data,
            errors: responseData.errors,
          },
          userErrors: userErrors,
        },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error("Error in addCartLines:", error);
    return NextResponse.json(
      { error: "Failed to add items to cart", details: error.message },
      { status: 500 }
    );
  }
}
