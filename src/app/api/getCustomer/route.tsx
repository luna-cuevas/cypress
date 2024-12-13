// /app/api/getCustomer/route.ts

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    // Retrieve access token from cookies
    const accessToken = req.cookies.get("shopifyAccessToken")?.value;

    if (!accessToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const query = `
      query getCustomer($customerAccessToken: String!) {
        customer(customerAccessToken: $customerAccessToken) {
          id
          firstName
          lastName
          email
          phone
          addresses(first: 5) {
            edges {
              node {
                id
                address1
                address2
                city
                province
                zip
                country
              }
            }
          }
        }
      }
    `;

    const variables = {
      customerAccessToken: accessToken,
    };

    const response = await fetch(process.env.SHOPIFY_STOREFRONT_API_URL!, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token":
          process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN!,
      },
      body: JSON.stringify({ query, variables }),
    });

    const data = await response.json();

    if (data.data && data.data.customer) {
      const customer = data.data.customer;

      // Transform addresses
      const addresses = customer.addresses.edges.map((edge: any) => edge.node);

      return NextResponse.json(
        { customer: { ...customer, addresses } },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { error: "Failed to fetch customer data." },
        { status: 400 }
      );
    }
  } catch (error: any) {
    console.error("Error fetching customer data:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}
