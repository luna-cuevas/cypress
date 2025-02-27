// /app/api/cartLinesRemove/route.js

import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    let { cartId, lineIds } = await req.json();

    const mutation = `
      mutation cartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
        cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
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
      lineIds,
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
    console.log("Remove cart lines response:", responseData);

    // Extract user errors if they exist
    const userErrors = responseData.data?.cartLinesRemove?.userErrors || [];

    // Check if any errors are about cart not existing
    const cartNotFound = userErrors.some((err: { message: string }) =>
      err.message.includes("cart does not exist")
    );

    if (
      responseData.data &&
      responseData.data.cartLinesRemove &&
      responseData.data.cartLinesRemove.cart
    ) {
      return NextResponse.json({
        cart: responseData.data.cartLinesRemove.cart,
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
      return NextResponse.json(
        {
          error: "Failed to remove lines from cart",
          details: responseData,
          userErrors: userErrors,
        },
        { status: 500 }
      );
    }
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to remove lines from cart", details: error.message },
      { status: 500 }
    );
  }
}
