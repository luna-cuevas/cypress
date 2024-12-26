import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const SHOPIFY_STOREFRONT_URL = process.env.NEXT_PUBLIC_SHOPIFY_STORE_URL;
const SHOPIFY_STOREFRONT_TOKEN = process.env.SHOPIFY_STOREFRONT_TOKEN;

export async function GET() {
  try {
    const cookieStore = cookies();
    const shopifyCustomerToken = cookieStore.get("_shopify_y")?.value;

    if (!shopifyCustomerToken) {
      return NextResponse.json(
        { error: "No customer token found" },
        { status: 401 }
      );
    }

    const query = `
      query getCustomerOrders($customerAccessToken: String!) {
        customer(customerAccessToken: $customerAccessToken) {
          orders(first: 20, reverse: true) {
            edges {
              node {
                id
                orderNumber
                processedAt
                financialStatus
                fulfillmentStatus
                currentTotalPrice {
                  amount
                  currencyCode
                }
                lineItems(first: 10) {
                  edges {
                    node {
                      title
                      quantity
                      variant {
                        id
                        title
                        price {
                          amount
                          currencyCode
                        }
                        image {
                          url
                          altText
                        }
                      }
                    }
                  }
                }
                shippingAddress {
                  address1
                  address2
                  city
                  provinceCode
                  zip
                  country
                }
                statusUrl
              }
            }
          }
        }
      }
    `;

    const response = await fetch(SHOPIFY_STOREFRONT_URL!, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": SHOPIFY_STOREFRONT_TOKEN!,
      },
      body: JSON.stringify({
        query,
        variables: {
          customerAccessToken: shopifyCustomerToken,
        },
      }),
    });

    const data = await response.json();

    if (data.errors) {
      console.error("Shopify API Errors:", data.errors);
      return NextResponse.json(
        { error: "Failed to fetch orders" },
        { status: 500 }
      );
    }

    return NextResponse.json(data.data.customer.orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}
