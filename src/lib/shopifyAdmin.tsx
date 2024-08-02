import "@shopify/shopify-api/adapters/node";
import { shopifyApi, ApiVersion, Session } from "@shopify/shopify-api";
import { restResources } from "@shopify/shopify-api/rest/admin/2023-04";

const shopifyAdmin = shopifyApi({
  apiKey: `${process.env.SHOPIFY_API_KEY}`,
  apiSecretKey: `${process.env.SHOPIFY_API_SECRET}`,
  apiVersion: ApiVersion.April23,
  isCustomStoreApp: true, // this MUST be set to true (default is false)
  adminApiAccessToken: `${process.env.SHOPIFY_ADMIN_API_TOKEN}`,
  isEmbeddedApp: false,
  hostName: `${process.env.SHOPIFY_HOSTNAME}`,
  // Mount REST resources.
  restResources,
});

const session = shopifyAdmin.session.customAppSession(
  `${process.env.SHOPIFY_STOREFRONT_API_URL}`
);

export const adminClient = new shopifyAdmin.clients.Graphql({ session });
