import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const SHOPIFY_STORE_DOMAIN = process.env.SHOPIFY_STORE_DOMAIN;
const SHOPIFY_STOREFRONT_ACCESS_TOKEN =
  process.env.SHOPIFY_STOREFRONT_API_TOKEN;

export async function GET() {
  try {
    const cookieStore = cookies();
    // Get all cookies that start with _shopify
    const shopifyCookies = cookieStore
      .getAll()
      .filter((cookie) => cookie.name.startsWith("_shopify"))
      .map((cookie) => `${cookie.name}=${cookie.value}`)
      .join("; ");

    if (!shopifyCookies) {
      return NextResponse.json({ customer: null });
    }

    // First get the customer access token
    const getTokenQuery = `
      query {
        customer_token: customerAccessToken {
          accessToken
          expiresAt
        }
      }
    `;

    const tokenResponse = await fetch(
      `https://${SHOPIFY_STORE_DOMAIN}/api/2024-01/graphql.json`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Shopify-Storefront-Access-Token": SHOPIFY_STOREFRONT_ACCESS_TOKEN!,
          Cookie: shopifyCookies,
        },
        body: JSON.stringify({ query: getTokenQuery }),
      }
    );

    const tokenData = await tokenResponse.json();
    console.log("Token response:", tokenData);

    if (tokenData.errors || !tokenData.data?.customer_token?.accessToken) {
      return NextResponse.json({ customer: null });
    }

    const accessToken = tokenData.data.customer_token.accessToken;

    // Now get the customer data using the access token
    const getCustomerQuery = `
      query($accessToken: String!) {
        customer(customerAccessToken: $accessToken) {
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

    const customerResponse = await fetch(
      `https://${SHOPIFY_STORE_DOMAIN}/api/2024-01/graphql.json`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Shopify-Storefront-Access-Token": SHOPIFY_STOREFRONT_ACCESS_TOKEN!,
        },
        body: JSON.stringify({
          query: getCustomerQuery,
          variables: {
            accessToken,
          },
        }),
      }
    );

    const customerData = await customerResponse.json();
    console.log("Customer response:", customerData);

    if (customerData.errors) {
      console.error("Shopify GraphQL errors:", customerData.errors);
      return NextResponse.json({ customer: null });
    }

    return NextResponse.json({ customer: customerData.data?.customer || null });
  } catch (error) {
    console.error("Error fetching customer session:", error);
    return NextResponse.json({ customer: null });
  }
}
