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

    // First, get the customer access token
    const getTokenMutation = `
      mutation customerAccessTokenCreate($input: CustomerAccessTokenCreateInput!) {
        customerAccessTokenCreate(input: $input) {
          customerAccessToken {
            accessToken
            expiresAt
          }
          customerUserErrors {
            code
            field
            message
          }
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
          Cookie: `_shopify_y=${shopifyY}`,
        },
        body: JSON.stringify({
          query: getTokenMutation,
          variables: {
            input: {
              multipassToken: shopifyY,
            },
          },
        }),
      }
    );

    const tokenData = await tokenResponse.json();
    console.log("Token response:", tokenData);

    if (
      tokenData.errors ||
      !tokenData.data?.customerAccessTokenCreate?.customerAccessToken
    ) {
      return NextResponse.json({ customer: null });
    }

    const accessToken =
      tokenData.data.customerAccessTokenCreate.customerAccessToken.accessToken;

    // Now use the access token to get customer data
    const getCustomerQuery = `
      query getCustomer($customerAccessToken: String!) {
        customer(customerAccessToken: $customerAccessToken) {
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
            customerAccessToken: accessToken,
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
