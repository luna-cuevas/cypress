// /app/api/getCustomer/route.ts

import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  try {
    // Retrieve access token from cookies
    const cookieStore = cookies();
    const accessToken = cookieStore.get("shopifyAccessToken")?.value;

    if (!accessToken) {
      return NextResponse.json(
        { error: "No access token found" },
        { status: 401 }
      );
    }

    const query = `
      query customer($customerAccessToken: String!) {
        customer(customerAccessToken: $customerAccessToken) {
          id
          email
          firstName
          lastName
          addresses(first: 10) {
            edges {
              node {
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
        }
      }
    `;

    const variables = {
      customerAccessToken: accessToken,
    };

    const response = await fetch(
      `${process.env.SHOPIFY_STOREFRONT_API_URL}/api/2023-07/graphql.json`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Shopify-Storefront-Access-Token":
            process.env.SHOPIFY_STOREFRONT_API_TOKEN!,
        },
        body: JSON.stringify({ query, variables }),
      }
    );

    const responseData = await response.json();

    console.log("getCustomer response:", responseData);

    if (
      responseData.data &&
      responseData.data.customer &&
      responseData.data.customer.email
    ) {
      return NextResponse.json({
        customer: responseData.data.customer,
      });
    } else {
      return NextResponse.json(
        { error: "Failed to fetch customer", details: responseData },
        { status: 400 }
      );
    }
  } catch (error: any) {
    console.error("Error fetching customer data:", error);
    return NextResponse.json(
      { error: "Failed to fetch customer", details: error.message },
      { status: 500 }
    );
  }
}
