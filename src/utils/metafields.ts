// Define the MetafieldValue type for strongly-typed metafield access
export type MetafieldValue = {
  id?: string;
  value?: any;
  type?: string;
  reference?: any;
  displayValue?: string;
  metaobjectGids?: string[];
  directlyResolvedReference?: any;
  resolvedList?: Array<any>;
};

// Helper function to extract and format metafield values for both old and new API formats
export const getMetafieldValue = (metafield: any) => {
  if (!metafield) return null;

  try {
    // Check if this is a resolved reference or list of references
    if (metafield.resolvedList && Array.isArray(metafield.resolvedList)) {
      // This is a resolved list of metaobject references
      return metafield.resolvedList
        .filter((item: any) => item !== null)
        .map((item: any) => {
          const typedItem = item as any;
          return (
            typedItem.displayValue ||
            typedItem.handle ||
            typedItem.fields?.find((f: any) => f.key === "label")?.value ||
            typedItem.type
          );
        })
        .join(", ");
    }

    // Check for directly resolved reference
    if (metafield.directlyResolvedReference) {
      const ref = metafield.directlyResolvedReference as any;
      return (
        ref.handle ||
        ref.fields?.find((f: any) => f.key === "label")?.value ||
        ref.type ||
        "Unknown"
      );
    }

    // Handle human-readable reference values (typically from metadata API)
    if (metafield.type && metafield.type.includes("metaobject_reference")) {
      // If the reference has been resolved
      if (metafield.reference) {
        // Single reference
        if (!Array.isArray(metafield.reference)) {
          const ref = metafield.reference as any;
          return (
            ref.handle ||
            ref.fields?.find((f: any) => f.key === "label")?.value ||
            "Unknown"
          );
        }
        // Array of references
        return metafield.reference
          .map((ref: any) => {
            if (!ref) return "Unknown";
            return (
              ref.handle ||
              ref.fields?.find((f: any) => f.key === "label")?.value ||
              "Unknown"
            );
          })
          .join(", ");
      }
    }

    // Try to parse JSON values if the type indicates it might be JSON
    if (
      metafield.type &&
      (metafield.type.includes("json") ||
        metafield.type.includes("reference") ||
        metafield.type.includes("list"))
    ) {
      // For list.metaobject_reference
      if (metafield.type === "list.metaobject_reference") {
        // First try to get the display value
        if (metafield.displayValue) {
          return metafield.displayValue;
        }

        // Check if we have metaobjectGids but they weren't resolved
        if (
          metafield.metaobjectGids &&
          Array.isArray(metafield.metaobjectGids)
        ) {
          // Format nicely for display
          return `${metafield.metaobjectGids.length} items`;
        }
      }

      const parsed =
        typeof metafield.value === "string"
          ? JSON.parse(metafield.value)
          : metafield.value;

      // Handle array of references (common in Shopify metaobjects)
      if (Array.isArray(parsed)) {
        // For reference fields, the value is often a list of GIDs
        return parsed
          .map((item: any) => {
            if (typeof item === "object" && item !== null) {
              // It's already an object, extract useful info
              const typedItem = item as any;
              return (
                typedItem.handle ||
                typedItem.displayName ||
                typedItem.displayValue ||
                typedItem.type ||
                JSON.stringify(item)
              );
            }

            // It's a string GID, extract the last part
            if (typeof item === "string") {
              const parts = item.split("/");
              return parts[parts.length - 1];
            }

            return String(item);
          })
          .join(", ");
      }

      return typeof parsed === "object"
        ? JSON.stringify(parsed)
        : parsed.toString();
    }

    // Handle regular string value
    return metafield.value;
  } catch (e) {
    console.error("Error processing metafield value:", e);
    return typeof metafield.value === "object"
      ? JSON.stringify(metafield.value)
      : String(metafield.value || "");
  }
};

// Get values from the metafieldHumanReadable if available
export const getHumanReadableValue = (product: any, key: string) => {
  // Support both paths to metafieldHumanReadable
  const productDetails = product || {};
  const humanReadable =
    productDetails.metadata?.metafieldHumanReadable ||
    productDetails.metadata?.metafieldMap ||
    {};

  if (humanReadable[key]) {
    const value = humanReadable[key];

    // Handle array of resolved metaobjects
    if (Array.isArray(value)) {
      return value
        .filter((item) => item != null)
        .map(
          (item: any) =>
            item?.displayValue ||
            item?.displayName ||
            item?.handle ||
            item?.type ||
            "Unknown"
        )
        .join(", ");
    }

    // Handle single resolved metaobject
    if (value && typeof value === "object") {
      const typedValue = value as any;
      // Try multiple paths to get a displayable value
      return (
        typedValue.displayValue ||
        typedValue.displayName ||
        typedValue.handle ||
        typedValue.type ||
        (typedValue.resolvedList && Array.isArray(typedValue.resolvedList)
          ? typedValue.resolvedList
              .filter((item: any) => item !== null)
              .map((item: any) => item.displayValue || item.handle || item.type)
              .join(", ")
          : JSON.stringify(value))
      );
    }

    return value;
  }

  return null;
};

// Helper function to check if a value is array-like and format it properly
export const formatMultiValueField = (value: any): string => {
  // If it's null or undefined
  if (value == null) return "";

  // Already a string
  if (typeof value === "string") return value;

  // If it's a proper array
  if (Array.isArray(value)) {
    // Filter out null/empty values
    const validItems = value.filter((item) => item != null);

    // Empty array
    if (validItems.length === 0) return "";

    // Format each item, handling both string and object items
    return validItems
      .map((item) => {
        if (typeof item === "string") return item;

        // Handle object values - extract meaningful properties
        if (item && typeof item === "object") {
          return (
            item.displayValue ||
            item.displayName ||
            item.handle ||
            item.value ||
            item.name ||
            item.fields?.find((f: any) => f.key === "label")?.value ||
            item.type ||
            JSON.stringify(item)
          );
        }

        return String(item);
      })
      .join(", ");
  }

  // If it's an object, try to get a useful representation
  if (typeof value === "object") {
    return (
      value.displayValue ||
      value.displayName ||
      value.value ||
      value.name ||
      value.handle ||
      value.type ||
      JSON.stringify(value)
    );
  }

  // For other primitive types
  return String(value);
};

// Helper to check if we have any organized metafields to display
export const hasOrganizedMetafields = (
  organizedMetafields: Record<string, any>
): boolean => {
  return Object.values(organizedMetafields).some((val) => {
    // Check for non-null value
    if (val === null) return false;

    // Safely cast to MetafieldValue type
    const metafield = val as MetafieldValue;

    // Check for arrays with resolved values
    if (metafield.resolvedList && Array.isArray(metafield.resolvedList)) {
      return metafield.resolvedList.some((item: any) => item !== null);
    }

    // Check for direct value or reference
    return (
      metafield.value ||
      metafield.reference ||
      metafield.directlyResolvedReference ||
      (metafield.metaobjectGids && metafield.metaobjectGids.length > 0)
    );
  });
};

// Get product details formatted for display
export const getProductDetails = (product: any) => {
  return product
    ? {
        description: product.description || "No description available",
        vendor: product.vendor || "Unknown vendor",
        productType: product.productType || "Unknown type",
        // Display metadata if available, handle both old and new formats
        metadata: product.metadata || {},
        // Display metafields if available - support both formats
        metafields: product.metafields || [],
        adminMetafields: product.adminMetafields || {},
        // Use the organizedMetafields if available from any source
        organizedMetafields:
          product.organizedMetafields ||
          product.metadata?.organizedMetafields ||
          {},
      }
    : {
        description: "Product details not available",
        vendor: "",
        productType: "",
        metadata: {},
        metafields: [],
        adminMetafields: {},
        organizedMetafields: {},
      };
};

// Extract metafield map from product metadata
export const getMetafieldMap = (product: any) => {
  const productDetails = getProductDetails(product);

  return (
    productDetails.metadata?.metafieldMap ||
    Object.fromEntries(
      (productDetails.metafields || [])
        .filter(Boolean)
        .map((mf: any) => [`${mf.namespace}--${mf.key}`, mf])
    )
  );
};
