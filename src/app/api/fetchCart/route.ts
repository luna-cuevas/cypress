import { NextResponse } from "next/server";
import { shopifyClient } from "@/lib/shopify";

type CartId = {
  cartId: string;
};

export async function POST(req: Request) {
  try {
    const { cartId } = await req.json();

    if (!cartId) {
      return NextResponse.json({ cart: null });
    }

    const response = await shopifyClient.request(
      `query($cartId: ID!) {
        cart(id: $cartId) {
          id
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
                      images(first: 1) {
                        edges {
                          node {
                            url
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
          checkoutUrl
        }
      }`,
      {
        // @ts-ignore
        cartId,
      }
    );

    const { data } = response;
    return NextResponse.json({ cart: data.cart });
  } catch (error) {
    console.error("Error fetching cart:", error);
    return NextResponse.json(
      { error: "Failed to fetch cart" },
      { status: 500 }
    );
  }
}
