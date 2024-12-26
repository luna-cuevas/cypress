const domain = process.env.SHOPIFY_HOSTNAME;
const storefrontAccessToken = process.env.SHOPIFY_STOREFRONT_API_TOKEN;

export async function shopifyFetch({
  query,
  variables,
  cache = "force-cache",
}: {
  query: string;
  variables?: any;
  cache?: RequestCache;
}) {
  try {
    const endpoint = `https://${domain}/api/2023-07/graphql.json`;

    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": storefrontAccessToken!,
      },
      body: JSON.stringify({ query, variables }),
      cache,
    };

    const response = await fetch(endpoint, options);

    if (!response.ok) {
      throw new Error(`Error fetching data: ${response.statusText}`);
    }

    const json = await response.json();
    console.log("Response:", json);

    if (json.errors) {
      throw new Error(
        `Error in GraphQL response: ${JSON.stringify(json.errors, null, 2)}`
      );
    }

    return json.data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}
