import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { lineItems } = await req.json();

    console.log("Creating cart with line items:", lineItems);

    // Build the GraphQL mutation
    const query = `
      mutation cartCreate($input: CartInput!) {
        cartCreate(input: $input) {
          cart {
            id
            checkoutUrl
          }
          userErrors {
            field
            message
          }
        }
      }
    `;

    const variables = {
      input: {
        lines: lineItems.map((item: any) => ({
          quantity: parseInt(item.quantity, 10), // Convert quantity to an integer
          merchandiseId: item.variantId,
        })),
      },
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
      body: JSON.stringify({ query, variables }),
    });

    const responseData = await response.json();

    console.log("server createCart response:", responseData);

    if (responseData.data && responseData.data.cartCreate.cart) {
      return NextResponse.json({
        checkoutUrl: responseData.data.cartCreate.cart.checkoutUrl,
      });
    } else {
      console.error("Failed to create cart:", responseData);
      return NextResponse.json(
        { error: "Failed to create cart", details: responseData },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Failed to create Shopify cart:", error);
    return NextResponse.json(
      { error: "Failed to create cart" },
      { status: 500 }
    );
  }
}
