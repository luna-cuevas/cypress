import { NextResponse } from "next/server";

const SHOPIFY_STORE_DOMAIN = process.env.SHOPIFY_STORE_DOMAIN;
const SHOPIFY_STOREFRONT_ACCESS_TOKEN =
  process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;

export async function POST(request: Request) {
  try {
    const { customerId, productId, action } = await request.json();

    if (!customerId) {
      return NextResponse.json(
        { error: "Customer ID is required" },
        { status: 400 }
      );
    }

    // GraphQL mutation to update customer metafield
    const mutation = `
      mutation updateCustomerMetafield($input: CustomerMetafieldsSetInput!) {
        customerMetafieldsSet(input: $input) {
          metafields {
            key
            value
          }
          userErrors {
            field
            message
          }
        }
      }
    `;

    // Get current favorites
    const getFavoritesQuery = `
      query getCustomerMetafields($customerId: ID!) {
        customer(id: $customerId) {
          metafield(namespace: "custom", key: "favorites") {
            value
          }
        }
      }
    `;

    // Fetch current favorites
    const getFavoritesResponse = await fetch(
      `https://${SHOPIFY_STORE_DOMAIN}/api/2024-01/graphql.json`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Shopify-Storefront-Access-Token": SHOPIFY_STOREFRONT_ACCESS_TOKEN!,
        },
        body: JSON.stringify({
          query: getFavoritesQuery,
          variables: {
            customerId,
          },
        }),
      }
    );

    const favoritesData = await getFavoritesResponse.json();
    const currentFavorites = favoritesData.data.customer?.metafield?.value
      ? JSON.parse(favoritesData.data.customer.metafield.value)
      : [];

    // Update favorites based on action
    let newFavorites = currentFavorites;
    if (action === "add") {
      if (!currentFavorites.includes(productId)) {
        newFavorites = [...currentFavorites, productId];
      }
    } else if (action === "remove") {
      newFavorites = currentFavorites.filter((id: string) => id !== productId);
    }

    // Update metafield with new favorites
    const response = await fetch(
      `https://${SHOPIFY_STORE_DOMAIN}/api/2024-01/graphql.json`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Shopify-Storefront-Access-Token": SHOPIFY_STOREFRONT_ACCESS_TOKEN!,
        },
        body: JSON.stringify({
          query: mutation,
          variables: {
            input: {
              customerId,
              metafields: [
                {
                  namespace: "custom",
                  key: "favorites",
                  value: JSON.stringify(newFavorites),
                  type: "json",
                },
              ],
            },
          },
        }),
      }
    );

    const data = await response.json();

    if (data.errors) {
      throw new Error(data.errors[0].message);
    }

    return NextResponse.json({ favorites: newFavorites });
  } catch (error) {
    console.error("Error updating favorites:", error);
    return NextResponse.json(
      { error: "Failed to update favorites" },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const customerId = searchParams.get("customerId");

    if (!customerId) {
      return NextResponse.json(
        { error: "Customer ID is required" },
        { status: 400 }
      );
    }

    const query = `
      query getCustomerMetafields($customerId: ID!) {
        customer(id: $customerId) {
          metafield(namespace: "custom", key: "favorites") {
            value
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
        body: JSON.stringify({
          query,
          variables: {
            customerId,
          },
        }),
      }
    );

    const data = await response.json();
    const favorites = data.data.customer?.metafield?.value
      ? JSON.parse(data.data.customer.metafield.value)
      : [];

    return NextResponse.json({ favorites });
  } catch (error) {
    console.error("Error fetching favorites:", error);
    return NextResponse.json(
      { error: "Failed to fetch favorites" },
      { status: 500 }
    );
  }
}
