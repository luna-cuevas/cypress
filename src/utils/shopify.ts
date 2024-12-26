import { shopifyFetch } from "@/utils/fetch";

// Add getVendors function
export async function getVendors() {
  const query = `
    query {
      products(first: 250) {
        edges {
          node {
            vendor
          }
        }
      }
    }
  `;

  try {
    const response = await shopifyFetch({
      query,
      cache: "force-cache",
    });

    const vendors = response.products.edges
      .map((edge: any) => edge.node.vendor)
      .filter((vendor: string) => vendor) // Remove empty vendors
      .filter(
        (value: string, index: number, self: string[]) =>
          self.indexOf(value) === index
      ) // Remove duplicates
      .sort((a: string, b: string) => a.localeCompare(b)); // Sort alphabetically

    return vendors;
  } catch (error) {
    console.error("Error fetching vendors:", error);
    return [];
  }
}
