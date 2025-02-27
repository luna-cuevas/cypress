import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    let { cartId } = await req.json();

    // Don't strip query parameters - they're needed for Shopify
    // if (cartId && cartId.includes("?")) {
    //   cartId = cartId.split("?")[0];
    //   console.log("Normalized cart ID for fetch:", cartId);
    // }

    // Ensure cart ID has the proper Shopify format
    if (cartId && !cartId.startsWith("gid://shopify/Cart/")) {
      cartId = `gid://shopify/Cart/${cartId}`;
      console.log("Formatted cart ID for Shopify:", cartId);
    }

    console.log("Fetching cart with ID:", cartId);

    const query = `
      query getCart($cartId: ID!) {
        cart(id: $cartId) {
          id
          checkoutUrl
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
      }
    `;

    const variables = { cartId };

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
      body: JSON.stringify({ query, variables }),
    });

    const responseData = await response.json();
    console.log("Fetch cart response:", responseData);

    if (responseData.data && responseData.data.cart) {
      return NextResponse.json({
        cart: responseData.data.cart,
      });
    } else {
      console.error("Failed to fetch cart:", responseData);

      // Check if this is a "cart not found" case (which is normal and should not be treated as a server error)
      // Shopify returns null for cart when the ID doesn't exist
      if (responseData.data && responseData.data.cart === null) {
        return NextResponse.json(
          { status: "cart_not_found", message: "Cart not found" },
          { status: 404 }
        );
      }

      // For actual errors (not just missing cart)
      return NextResponse.json(
        { error: "Failed to fetch cart", details: responseData },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error("Failed to fetch Shopify cart:", error);
    return NextResponse.json(
      { error: "Failed to fetch cart", details: error.message },
      { status: 500 }
    );
  }
}
