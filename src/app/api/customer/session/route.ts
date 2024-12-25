import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const SHOPIFY_STORE_DOMAIN = process.env.SHOPIFY_STORE_DOMAIN;
const SHOPIFY_STOREFRONT_ACCESS_TOKEN =
  process.env.SHOPIFY_STOREFRONT_API_TOKEN;

export async function GET() {
  try {
    const cookieStore = cookies();
    const shopifyY = cookieStore.get("_shopify_y")?.value;

    if (!shopifyY) {
      return NextResponse.json({ customer: null });
    }

    // Query current customer data
    const query = `
      query {
        customer {
          id
          firstName
          lastName
          email
          phone
          defaultAddress {
            id
            address1
            address2
            city
            province
            country
            zip
          }
        }
      }
    `;

    const response = await fetch(
      `https://${SHOPIFY_STORE_DOMAIN}/api/2024-01/graphql.json`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Shopify-Storefront-Access-Token": SHOPIFY_STOREFRONT_ACCESS_TOKEN!,
          Cookie: `_shopify_y=${shopifyY}`,
        },
        body: JSON.stringify({ query }),
        credentials: "include",
      }
    );

    const data = await response.json();
    console.log("Customer response:", data);

    if (data.errors) {
      console.error("Shopify GraphQL errors:", data.errors);
      return NextResponse.json({ customer: null });
    }

    return NextResponse.json({ customer: data.data?.customer || null });
  } catch (error) {
    console.error("Error fetching customer session:", error);
    return NextResponse.json({ customer: null });
  }
}
