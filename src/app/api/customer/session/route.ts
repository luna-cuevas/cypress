import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const SHOPIFY_STORE_DOMAIN = process.env.SHOPIFY_STORE_DOMAIN;
const SHOPIFY_STOREFRONT_ACCESS_TOKEN =
  process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;

export async function GET() {
  try {
    const cookieStore = cookies();
    const shopifyCustomerAccessToken = cookieStore.get("_shopify_y")?.value;

    if (!shopifyCustomerAccessToken) {
      return NextResponse.json({ customer: null });
    }

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
        },
        body: JSON.stringify({ query }),
      }
    );

    const data = await response.json();

    if (data.errors) {
      throw new Error(data.errors[0].message);
    }

    return NextResponse.json({ customer: data.data.customer });
  } catch (error) {
    console.error("Error fetching customer session:", error);
    return NextResponse.json({ customer: null });
  }
}
