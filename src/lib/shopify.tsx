import { createStorefrontApiClient } from "@shopify/storefront-api-client";

export const shopifyClient = createStorefrontApiClient({
  storeDomain: `${process.env.SHOPIFY_STOREFRONT_API_URL}`,
  apiVersion: "2024-04",
  publicAccessToken: process.env.SHOPIFY_STOREFRONT_API_TOKEN,
});
