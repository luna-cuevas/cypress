import { NextResponse } from "next/server";
import { createStorefrontApiClient } from "@shopify/storefront-api-client";

// Create a Storefront API client with environment variables
const createClient = () => {
  // Make sure to include protocol in storeDomain if not already present
  const storeDomain =
    process.env.SHOPIFY_STORE_DOMAIN || "cypress-storefront.myshopify.com";
  // Format domain - remove http/https if present as the client will add it
  const formattedDomain = storeDomain.replace(/^https?:\/\//, "");

  return createStorefrontApiClient({
    storeDomain: formattedDomain,
    apiVersion: "2024-07", // Updated to use the latest regular release version
    publicAccessToken:
      process.env.SHOPIFY_STOREFRONT_API_TOKEN ||
      "aaac8bfb8d762d1fc7466101ee6fb3e6",
    clientName: "cypress-store-app", // Add a client name for better logging
    retries: 3, // Add retry logic
  });
};

/**
 * API endpoint to fetch product metadata from the Shopify Storefront API
 * @param req - The incoming request with query parameters
 * @returns JSON response with product metadata
 */
export async function GET(req: Request) {
  const url = new URL(req.url);
  // Accept both 'handle' and 'product' parameters for backward compatibility
  const handle =
    url.searchParams.get("handle") || url.searchParams.get("product");
  // New parameter to optionally specify which metafields to fetch
  const metafieldSelectors = url.searchParams.get("metafields");

  if (!handle) {
    return NextResponse.json(
      {
        error:
          "Product handle is required (use 'handle' or 'product' parameter)",
      },
      { status: 400 }
    );
  }

  try {
    // Parse metafield selectors if provided
    let parsedMetafieldSelectors = [];
    if (metafieldSelectors) {
      try {
        parsedMetafieldSelectors = JSON.parse(metafieldSelectors);
      } catch (e) {
        console.warn("Invalid metafield selectors format:", metafieldSelectors);
      }
    }

    // Fetch product metadata using the Storefront API client
    const metadata = await fetchProductMetadata(
      handle,
      parsedMetafieldSelectors
    );

    return NextResponse.json({
      metadata,
      _debug: {
        handle,
        apiVersion: "2024-07",
        storeDomain:
          process.env.SHOPIFY_STORE_DOMAIN ||
          "cypress-storefront.myshopify.com",
        tokenAvailable: !!process.env.SHOPIFY_STOREFRONT_API_TOKEN,
        timestamp: new Date().toISOString(),
        metafieldSelectorsUsed:
          parsedMetafieldSelectors.length > 0
            ? parsedMetafieldSelectors
            : "default",
        metaobjectAccess: hasMetaobjectReferences(metadata)
          ? {
              referencesResolved: hasResolvedReferences(
                metadata.metafieldHumanReadable
              ),
              metaobjectCount: countMetaobjectReferences(metadata),
              resolvedCount: countResolvedMetaobjectReferences(metadata),
              message: hasResolvedReferences(metadata.metafieldHumanReadable)
                ? "Metaobject references successfully resolved"
                : "Metaobject references could not be resolved - check API access scopes",
              requiredScopes: [
                "unauthenticated_read_metaobjects",
                "unauthenticated_read_product_metafields",
                "unauthenticated_read_content",
              ],
              guide:
                "https://shopify.dev/docs/api/storefront/latest/objects/metaobject",
            }
          : null,
      },
    });
  } catch (error: any) {
    console.error("Error fetching product metadata:", error);
    return NextResponse.json(
      {
        error: error.message || "Failed to fetch product metadata",
        _debug: {
          errorMessage: error.message,
          errorStack: error.stack,
          handle,
          apiVersion: "2024-07",
          storeDomain:
            process.env.SHOPIFY_STORE_DOMAIN ||
            "cypress-storefront.myshopify.com",
          tokenAvailable: !!process.env.SHOPIFY_STOREFRONT_API_TOKEN,
          timestamp: new Date().toISOString(),
        },
      },
      { status: 500 }
    );
  }
}

// Define types for our metafields
type MetaobjectField = {
  key: string;
  value: string;
  reference?: any;
};

type MetaobjectReference = {
  id: string;
  handle: string;
  type: string;
  fields: MetaobjectField[];
};

type MetafieldNode = {
  namespace: string;
  key: string;
  value: string;
  type: string;
  id: string;
  reference?: MetaobjectReference | null;
};

type MetafieldValue = {
  id: string;
  value: string;
  type: string;
  reference?: MetaobjectReference | null;
  displayValue?: string;
  metaobjectGids?: string[];
  // Added for direct resolution of metaobjects when reference is null
  directlyResolvedReference?: any;
  resolvedList?: Array<{
    id: string;
    handle: string;
    type: string;
    displayValue: string;
    fields: any[];
    isResolvedReference: boolean;
  } | null>;
};

type MetafieldMap = {
  [key: string]: MetafieldValue;
};

type OrganizedMetafields = {
  fabric: MetafieldValue | null;
  color: MetafieldValue | null;
  colorPattern: MetafieldValue | null;
  size: MetafieldValue | null;
  fit: MetafieldValue | null;
  targetGender: MetafieldValue | null;
  ageGroup: MetafieldValue | null;
  sleeveLength: MetafieldValue | null;
  topLength: MetafieldValue | null;
  neckline: MetafieldValue | null;
  pantsLength: MetafieldValue | null;
  accessorySize: MetafieldValue | null;
  [key: string]: MetafieldValue | null; // Allow for dynamic metafields
};

// Type for metafield selectors
type MetafieldSelector = {
  namespace: string;
  key: string;
};

/**
 * Default metafield selectors used if none are provided
 */
const DEFAULT_METAFIELD_SELECTORS: MetafieldSelector[] = [
  { namespace: "shopify", key: "fabric" },
  { namespace: "shopify", key: "color" },
  { namespace: "shopify", key: "color-pattern" },
  { namespace: "shopify", key: "size" },
  { namespace: "shopify", key: "fit" },
  { namespace: "shopify", key: "target-gender" },
  { namespace: "shopify", key: "age-group" },
  { namespace: "shopify", key: "sleeve-length-type" },
  { namespace: "shopify", key: "top-length-type" },
  { namespace: "shopify", key: "neckline" },
  { namespace: "shopify", key: "pants-length-type" },
  { namespace: "shopify", key: "accessory-size" },
];

/**
 * Parse metaobject reference values to extract human-readable values
 */
function parseMetaobjectValue(metafield: MetafieldNode): any {
  // For non-reference types, just return the raw value
  if (!metafield.type || !metafield.type.includes("metaobject_reference")) {
    return metafield.value;
  }

  // For reference types, check if the reference was populated
  if (metafield.reference) {
    // If we have the reference data, extract useful information
    if (metafield.type === "list.metaobject_reference") {
      // For list types, return an array of parsed values
      if (Array.isArray(metafield.reference)) {
        return metafield.reference.map((ref) => extractMetaobjectData(ref));
      } else {
        // Sometimes the API returns a single object even for list types
        // This might indicate the API didn't correctly resolve all items
        // First check if the metafield.value contains multiple GIDs
        try {
          const parsed = JSON.parse(metafield.value);
          if (Array.isArray(parsed) && parsed.length > 1) {
            // We have multiple GIDs but only one resolved reference
            // Return an array with the single resolved reference and placeholders for others
            const result = new Array(parsed.length).fill(null);
            // Place the single resolved reference at appropriate position
            const gid = (metafield.reference as any).id;
            const gidIndex = parsed.indexOf(gid);
            if (gidIndex >= 0) {
              result[gidIndex] = extractMetaobjectData(metafield.reference);
            } else {
              // If we can't find the exact position, just put it first
              result[0] = extractMetaobjectData(metafield.reference);
            }
            return result;
          }
        } catch (e) {
          // If parsing fails, just use the single reference
        }
        return [extractMetaobjectData(metafield.reference)];
      }
    } else {
      // Single metaobject reference
      return extractMetaobjectData(metafield.reference);
    }
  } else {
    // If reference is null (likely due to missing API scopes), try to parse the raw value
    try {
      if (metafield.value) {
        const parsed = JSON.parse(metafield.value);

        // For list types, properly format as an array of placeholder items
        if (
          metafield.type === "list.metaobject_reference" &&
          Array.isArray(parsed)
        ) {
          return parsed.map((gid) => ({
            id: gid,
            raw: gid,
            message: "Reference data not available. Check API token scopes.",
            isResolvedReference: false,
          }));
        }

        // Return a more helpful structure for unreferenced GIDs
        return {
          raw: parsed,
          message:
            "Reference data not available. Make sure your API token has the required scopes: unauthenticated_read_metaobjects, unauthenticated_read_product_metafields, unauthenticated_read_content",
          isResolvedReference: false,
        };
      }
    } catch (e) {
      // If parsing fails, return the raw value
      return metafield.value;
    }

    return metafield.value;
  }
}

/**
 * Extract useful data from a metaobject reference
 */
function extractMetaobjectData(metaobject: MetaobjectReference): any {
  if (!metaobject) {
    return null;
  }

  // Extract the display name
  const displayName = getDisplayNameFromMetaobject(metaobject);

  // Return a consistent object structure with all important fields
  return {
    id: metaobject.id,
    handle: metaobject.handle,
    type: metaobject.type,
    displayName,
    fields: metaobject.fields,
    isResolvedReference: true,
  };
}

/**
 * Extract a display name from a metaobject based on common field names
 */
function getDisplayNameFromMetaobject(metaobject: MetaobjectReference): string {
  if (!metaobject || !metaobject.fields) {
    return metaobject?.handle || "Unknown";
  }

  // Look for common field names that would contain display values
  const displayField = metaobject.fields.find(
    (field) =>
      field.key === "name" ||
      field.key === "title" ||
      field.key === "value" ||
      field.key === "display_name" ||
      field.key === "label"
  );

  if (displayField) {
    return displayField.value;
  }

  // Fallback to handle or type if no display field is found
  return metaobject.handle || metaobject.type || "Unknown";
}

/**
 * Fetches product metadata from Shopify Storefront API using the official client
 * @param handle - The product handle
 * @param metafieldSelectors - Optional array of metafield selectors to fetch specific metafields
 */
async function fetchProductMetadata(
  handle: string,
  metafieldSelectors: MetafieldSelector[] = []
) {
  // Initialize the Shopify Storefront API client
  const client = createClient();

  // Use provided metafield selectors or fall back to defaults
  const selectorsToUse =
    metafieldSelectors.length > 0
      ? metafieldSelectors
      : DEFAULT_METAFIELD_SELECTORS;

  // Generate the metafields fragment of the query
  const metafieldsQueryFragment = `
    metafields(
      identifiers: [
        ${selectorsToUse
          .map(
            (selector) =>
              `{namespace: "${selector.namespace}", key: "${selector.key}"}`
          )
          .join(",\n        ")}
      ]
    ) {
      namespace
      key
      value
      type
      id
      reference {
        ... on Metaobject {
          id
          handle
          type
          fields {
            key
            value
            reference {
              ... on Metaobject {
                handle
                type
                fields {
                  key
                  value
                }
              }
            }
          }
        }
      }
    }
  `;

  // Alternate approach - retrieve all metafields (will only return exposed ones)
  // Note: This approach is used when selectorsToUse is empty
  const allMetafieldsQueryFragment = `
    metafields(first: 50) {
      nodes {
        namespace
        key
        value
        type
        id
        reference {
          ... on Metaobject {
            id
            handle
            type
            fields {
              key
              value
              reference {
                ... on Metaobject {
                  handle
                  type
                  fields {
                    key
                    value
                  }
                }
              }
            }
          }
        }
      }
    }
  `;

  // Choose which metafields query to use
  const metafieldsQuery =
    selectorsToUse.length > 0
      ? metafieldsQueryFragment
      : allMetafieldsQueryFragment;

  // Updated query for Shopify Storefront API with dynamic metafield handling
  const query = `
    query GetProductMetadata($handle: String!) {
      product(handle: $handle) {
        id
        title
        description
        descriptionHtml
        vendor
        productType
        tags
        onlineStoreUrl
        options {
          name
          values
        }
        seo {
          title
          description
        }
        ${metafieldsQuery}
        images(first: 10) {
          edges {
            node {
              src
              altText
            }
          }
        }
      }
    }
  `;

  try {
    // Use the client to execute the GraphQL query
    const { data, errors } = await client.request(query, {
      variables: { handle },
    });

    // Handle GraphQL errors if present
    if (errors && Array.isArray(errors) && errors.length > 0) {
      throw new Error(`GraphQL errors: ${JSON.stringify(errors)}`);
    }

    // Check if product was found
    if (!data?.product) {
      throw new Error(`Product not found with handle: ${handle}`);
    }

    const product = data.product;

    // Process metafields if they exist
    if (product.metafields) {
      // Transform the metafields into a more accessible format
      const metafieldMap: MetafieldMap = {};
      const metafieldHumanReadable: Record<string, any> = {};

      // Handle different metafield query structures based on API version
      let metafieldsArray: MetafieldNode[] = [];

      if (Array.isArray(product.metafields)) {
        // Direct array of metafields (from identifiers query)
        metafieldsArray = product.metafields;
      } else if (product.metafields?.nodes) {
        // Newer API format (2024-04+) using nodes
        metafieldsArray = product.metafields.nodes;
      } else if (product.metafields?.edges) {
        // Older API format using edges
        metafieldsArray = product.metafields.edges.map(
          (edge: any) => edge.node
        );
      }

      // If we have any metaobject reference fields with null references, try to fetch those metaobjects directly
      const metaobjectGids: string[] = [];
      const metaobjectGidToKeyMap: Record<string, string[]> = {};

      // First pass: identify all metaobject GIDs that need to be resolved
      metafieldsArray.forEach((node: MetafieldNode | null) => {
        if (!node || !node.namespace || !node.key || !node.type || !node.value)
          return;

        if (node.type.includes("metaobject_reference") && !node.reference) {
          try {
            // Extract the GIDs from the value field
            let gids: string[] = [];

            if (node.type === "list.metaobject_reference") {
              gids = JSON.parse(node.value);
            } else if (node.type === "metaobject_reference") {
              gids = [node.value];
            }

            // Track each GID and which metafield keys it belongs to
            gids.forEach((gid) => {
              if (!metaobjectGids.includes(gid)) {
                metaobjectGids.push(gid);
              }

              const fullKey = `${node.namespace}--${node.key}`;
              if (!metaobjectGidToKeyMap[gid]) {
                metaobjectGidToKeyMap[gid] = [];
              }
              if (!metaobjectGidToKeyMap[gid].includes(fullKey)) {
                metaobjectGidToKeyMap[gid].push(fullKey);
              }
            });
          } catch (error) {
            console.error(
              `Error parsing metaobject references for ${node.namespace}--${node.key}:`,
              error
            );
          }
        }
      });

      // Enhanced metaobject reference processing
      metafieldsArray.forEach((node: MetafieldNode | null) => {
        if (!node || !node.namespace || !node.key) return;

        const fullKey = `${node.namespace}--${node.key}`;

        // Store the basic metafield info
        metafieldMap[fullKey] = {
          id: node.id,
          value: node.value,
          type: node.type,
        };

        // Add a human-readable parsed value
        metafieldHumanReadable[fullKey] = parseMetaobjectValue(node);

        // Process metaobject references if available
        if (
          node.type &&
          node.type.includes("metaobject_reference") &&
          node.reference
        ) {
          // For list types, parse the JSON array from value
          if (node.type === "list.metaobject_reference") {
            try {
              // Store the reference object for easier access
              metafieldMap[fullKey].reference = node.reference;

              // If you need to extract specific values from the metaobject
              if (node.reference && node.reference.fields) {
                const displayValue = node.reference.fields.find(
                  (field: any) =>
                    field.key === "name" ||
                    field.key === "title" ||
                    field.key === "value"
                );

                if (displayValue) {
                  metafieldMap[fullKey].displayValue = displayValue.value;
                }
              }
            } catch (error) {
              console.error(
                `Error processing metaobject references for ${fullKey}:`,
                error
              );
            }
          } else if (node.type === "metaobject_reference") {
            // Single metaobject reference
            metafieldMap[fullKey].reference = node.reference;

            // If you need to extract specific values from the metaobject
            if (node.reference && node.reference.fields) {
              const displayValue = node.reference.fields.find(
                (field: any) =>
                  field.key === "name" ||
                  field.key === "title" ||
                  field.key === "value"
              );

              if (displayValue) {
                metafieldMap[fullKey].displayValue = displayValue.value;
              }
            }
          }
        } else if (
          node.reference === null &&
          node.type &&
          node.type.includes("metaobject_reference")
        ) {
          // Try to parse the metaobject GIDs from the value
          if (node.value) {
            try {
              const gids = JSON.parse(node.value);
              if (Array.isArray(gids)) {
                metafieldMap[fullKey].metaobjectGids = gids;
              }
            } catch (error) {
              // Not a parseable JSON value
            }
          }
        }
      });

      // After all the normal processing, try to directly fetch metaobjects for the missing references
      if (metaobjectGids.length > 0) {
        try {
          // For each metaobject GID, execute a direct query to fetch its details
          const metaobjectBatches = [];
          for (let i = 0; i < metaobjectGids.length; i += 10) {
            // Create batches of up to 10 GIDs at a time
            metaobjectBatches.push(metaobjectGids.slice(i, i + 10));
          }

          // Process each batch
          for (const batch of metaobjectBatches) {
            const batchQuery = `
              query {
                ${batch
                  .map(
                    (gid, index) => `
                  metaobject${index}: node(id: "${gid}") {
                    ... on Metaobject {
                      id
                      handle
                      type
                      fields {
                        key
                        value
                      }
                    }
                  }
                `
                  )
                  .join("\n")}
              }
            `;

            const batchResult = await client.request(batchQuery);

            // Process the results
            if (batchResult && batchResult.data) {
              batch.forEach((gid, index) => {
                const metaobject = batchResult.data[`metaobject${index}`];
                if (metaobject) {
                  // Update all metafields that use this GID
                  const affectedKeys = metaobjectGidToKeyMap[gid] || [];
                  affectedKeys.forEach((fullKey) => {
                    // Only update if we haven't already resolved this metafield with references
                    if (
                      metafieldMap[fullKey] &&
                      !metafieldMap[fullKey].reference
                    ) {
                      // Store the resolved reference
                      metafieldMap[fullKey].directlyResolvedReference =
                        metaobject;

                      // Update the human-readable value
                      const displayValue =
                        getDisplayNameFromMetaobject(metaobject);

                      // If this is part of a list type, we need special handling
                      if (
                        metafieldMap[fullKey].type ===
                        "list.metaobject_reference"
                      ) {
                        // Get all GIDs for this metafield
                        const allGids =
                          metafieldMap[fullKey].metaobjectGids || [];

                        // Find index of current GID
                        const gidIndex = allGids.indexOf(gid);

                        // Initialize the resolved list if needed
                        if (!metafieldMap[fullKey].resolvedList) {
                          metafieldMap[fullKey].resolvedList = new Array(
                            allGids.length
                          ).fill(null);
                        }

                        // Update the specific item in the list
                        const resolvedList = metafieldMap[fullKey].resolvedList;
                        if (gidIndex >= 0 && resolvedList) {
                          resolvedList[gidIndex] = {
                            id: metaobject.id,
                            handle: metaobject.handle,
                            type: metaobject.type,
                            displayValue,
                            fields: metaobject.fields,
                            isResolvedReference: true,
                          };

                          // Also update the human-readable representation
                          const currentValue = metafieldHumanReadable[fullKey];
                          if (
                            currentValue &&
                            currentValue.raw &&
                            Array.isArray(currentValue.raw) &&
                            resolvedList
                          ) {
                            // Transform the raw GIDs into resolved references
                            metafieldHumanReadable[fullKey] =
                              resolvedList.filter((item) => item !== null);
                          }
                        }
                      } else {
                        // For single references, just replace the value
                        metafieldHumanReadable[fullKey] = {
                          id: metaobject.id,
                          handle: metaobject.handle,
                          type: metaobject.type,
                          displayName: displayValue,
                          fields: metaobject.fields,
                          isResolvedReference: true,
                        };
                      }
                    }
                  });
                } else {
                  console.log(`⚠️ Could not fetch metaobject with GID: ${gid}`);
                }
              });
            }
          }
        } catch (error) {
          console.error("Error fetching metaobjects directly:", error);
        }
      }

      // Add the metafield map to the product
      product.metafieldMap = metafieldMap;

      // Add human-readable values to the product
      product.metafieldHumanReadable = metafieldHumanReadable;

      // Create an organized structure with common metafields
      const organizedMetafields: OrganizedMetafields = {
        fabric: metafieldMap["shopify--fabric"] || null,
        color: metafieldMap["shopify--color"] || null,
        colorPattern: metafieldMap["shopify--color-pattern"] || null,
        size: metafieldMap["shopify--size"] || null,
        fit: metafieldMap["shopify--fit"] || null,
        targetGender: metafieldMap["shopify--target-gender"] || null,
        ageGroup: metafieldMap["shopify--age-group"] || null,
        sleeveLength: metafieldMap["shopify--sleeve-length-type"] || null,
        topLength: metafieldMap["shopify--top-length-type"] || null,
        neckline: metafieldMap["shopify--neckline"] || null,
        pantsLength: metafieldMap["shopify--pants-length-type"] || null,
        accessorySize: metafieldMap["shopify--accessory-size"] || null,
      };

      // Add any additional metafields from the response that aren't in our predefined list
      Object.keys(metafieldMap).forEach((key) => {
        const [namespace, metaKey] = key.split("--");
        const camelCaseKey = metaKey.replace(/-([a-z])/g, (g) =>
          g[1].toUpperCase()
        );

        if (!(camelCaseKey in organizedMetafields)) {
          organizedMetafields[camelCaseKey] = metafieldMap[key];
        }
      });

      product.organizedMetafields = organizedMetafields;
    }

    return product;
  } catch (error) {
    console.error("Error executing Storefront API query:", error);
    throw error;
  }
}

/**
 * Check if product has metaobject references
 */
function hasMetaobjectReferences(product: any): boolean {
  if (!product || !product.metafields) return false;

  // Check if any metafield is a metaobject reference
  return product.metafields.some(
    (metafield: any) =>
      metafield &&
      metafield.type &&
      metafield.type.includes("metaobject_reference")
  );
}

/**
 * Check if metaobject references have been resolved
 */
function hasResolvedReferences(humanReadableMap: Record<string, any>): boolean {
  if (!humanReadableMap) return false;

  // Check if any reference was successfully resolved
  return Object.values(humanReadableMap).some((value: any) => {
    if (!value) return false;

    // If it's marked as a resolved reference, we know it has been properly resolved
    if (value.isResolvedReference === true) {
      return true;
    }

    // Check arrays of references (for list types)
    if (Array.isArray(value) && value.length > 0) {
      return value.some((item: any) => item?.isResolvedReference === true);
    }

    // If it's marked as not resolved, return false
    if (value.isResolvedReference === false) {
      return false;
    }

    // Check for directly resolved references
    if (value.directlyResolvedReference) {
      return true;
    }

    // Legacy check for older data format
    if (value.message && value.message.includes("API token")) {
      return false;
    }

    // Legacy check for successfully resolved references that have fields
    return value.fields || (Array.isArray(value) && value[0]?.fields);
  });
}

/**
 * Count total metaobject references in product data
 */
function countMetaobjectReferences(product: any): number {
  if (!product || !product.metafields) return 0;

  let count = 0;

  // Count both list and single references
  product.metafields.forEach((metafield: any) => {
    if (metafield?.type?.includes("metaobject_reference")) {
      count++;
    }
  });

  return count;
}

/**
 * Count resolved metaobject references in product data
 */
function countResolvedMetaobjectReferences(product: any): number {
  if (!product || !product.metafieldHumanReadable) return 0;

  let count = 0;

  // Count all resolved references using the isResolvedReference flag
  Object.values(product.metafieldHumanReadable).forEach((value: any) => {
    if (!value) return;

    if (value.isResolvedReference === true) {
      count++;
    } else if (value.directlyResolvedReference) {
      count++;
    } else if (Array.isArray(value)) {
      // For list types, count each resolved item
      value.forEach((item: any) => {
        if (item?.isResolvedReference === true) {
          count++;
        }
      });
    } else if (product.metafieldMap) {
      // Check if we have a resolved list in the metafieldMap
      const key = Object.keys(product.metafieldMap).find(
        (k) => product.metafieldMap[k].value === JSON.stringify(value?.raw)
      );

      if (key && product.metafieldMap[key].resolvedList) {
        // Count non-null items in the resolved list
        count += product.metafieldMap[key].resolvedList.filter(
          (item: any) => item !== null
        ).length;
      }
    }
  });

  return count;
}
