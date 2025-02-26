"use client";
import React from "react";
import {
  Accordion,
  AccordionHeader,
  AccordionBody,
} from "@material-tailwind/react";

// Define the MetafieldValue type for strongly-typed metafield access
type MetafieldValue = {
  id?: string;
  value?: any;
  type?: string;
  reference?: any;
  displayValue?: string;
  metaobjectGids?: string[];
  directlyResolvedReference?: any;
  resolvedList?: Array<any>;
};

export function Accordions({ product }: { product?: any }) {
  const [open, setOpen] = React.useState(0);

  const handleOpen = (value: any) => setOpen(open === value ? 0 : value);

  // Extract product details for display
  const productDetails = product
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

  // Helper function to extract and format metafield values for both old and new API formats
  const getMetafieldValue = (metafield: any) => {
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
  const getHumanReadableValue = (key: string) => {
    // Support both paths to metafieldHumanReadable
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
                .map(
                  (item: any) => item.displayValue || item.handle || item.type
                )
                .join(", ")
            : JSON.stringify(value))
        );
      }

      return value;
    }

    return null;
  };

  // Helper to check if we have any organized metafields to display
  const hasOrganizedMetafields = Object.values(
    productDetails.organizedMetafields
  ).some((val) => {
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

  // Extract metafield map from product metadata - handle both API structures
  const metafieldMap =
    productDetails.metadata?.metafieldMap ||
    Object.fromEntries(
      (productDetails.metafields || [])
        .filter(Boolean)
        .map((mf: any) => [`${mf.namespace}--${mf.key}`, mf])
    );

  // Helper function to check if a value is array-like and format it properly
  const formatMultiValueField = (value: any): string => {
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

  return (
    <>
      {/* Product Specifications */}
      <Accordion open={open === 1}>
        <AccordionHeader
          className="text-md border-t-2 font-normal text-gray-600 dark:text-gray-400 hover:text-cypress-green focus:text-cypress-green dark:focus:text-cypress-green-light focus:font-bold"
          onClick={() => handleOpen(1)}>
          Product Specifications
        </AccordionHeader>
        <AccordionBody className="dark:text-gray-200">
          <div className="space-y-2">
            {/* Display main metafields */}
            {productDetails.organizedMetafields.fabric && (
              <p className="capitalize">
                <span className="font-medium">Fabric:</span>{" "}
                {formatMultiValueField(
                  getHumanReadableValue("shopify--fabric") ||
                    getMetafieldValue(productDetails.organizedMetafields.fabric)
                )}
              </p>
            )}

            {/* Display color and color-pattern metafields */}
            {(productDetails.organizedMetafields.color ||
              productDetails.organizedMetafields.colorPattern) && (
              <p className="capitalize">
                <span className="font-medium">Color/Pattern:</span>{" "}
                {formatMultiValueField(
                  getHumanReadableValue("shopify--color-pattern") ||
                    getHumanReadableValue("shopify--color") ||
                    getMetafieldValue(
                      productDetails.organizedMetafields.colorPattern
                    ) ||
                    getMetafieldValue(productDetails.organizedMetafields.color)
                )}
              </p>
            )}

            {productDetails.organizedMetafields.fit && (
              <p className="capitalize">
                <span className="font-medium">Fit:</span>{" "}
                {formatMultiValueField(
                  getHumanReadableValue("shopify--fit") ||
                    getMetafieldValue(productDetails.organizedMetafields.fit)
                )}
              </p>
            )}

            {productDetails.organizedMetafields.sleeveLength && (
              <p className="capitalize">
                <span className="font-medium">Sleeve Length:</span>{" "}
                {formatMultiValueField(
                  getHumanReadableValue("shopify--sleeve-length-type") ||
                    getMetafieldValue(
                      productDetails.organizedMetafields.sleeveLength
                    )
                )}
              </p>
            )}

            {productDetails.organizedMetafields.topLength && (
              <p className="capitalize">
                <span className="font-medium">Top Length:</span>{" "}
                {formatMultiValueField(
                  getHumanReadableValue("shopify--top-length-type") ||
                    getMetafieldValue(
                      productDetails.organizedMetafields.topLength
                    )
                )}
              </p>
            )}

            {productDetails.organizedMetafields.neckline && (
              <p className="capitalize">
                <span className="font-medium">Neckline:</span>{" "}
                {formatMultiValueField(
                  getHumanReadableValue("shopify--neckline") ||
                    getMetafieldValue(
                      productDetails.organizedMetafields.neckline
                    )
                )}
              </p>
            )}

            {productDetails.organizedMetafields.pantsLength && (
              <p className="capitalize">
                <span className="font-medium">Pants Length:</span>{" "}
                {formatMultiValueField(
                  getHumanReadableValue("shopify--pants-length-type") ||
                    getMetafieldValue(
                      productDetails.organizedMetafields.pantsLength
                    )
                )}
              </p>
            )}

            {productDetails.organizedMetafields.targetGender && (
              <p className="capitalize">
                <span className="font-medium">Gender:</span>{" "}
                {formatMultiValueField(
                  getHumanReadableValue("shopify--target-gender") ||
                    getMetafieldValue(
                      productDetails.organizedMetafields.targetGender
                    )
                )}
              </p>
            )}

            {productDetails.organizedMetafields.ageGroup && (
              <p className="capitalize">
                <span className="font-medium">Age Group:</span>{" "}
                {formatMultiValueField(
                  getHumanReadableValue("shopify--age-group") ||
                    getMetafieldValue(
                      productDetails.organizedMetafields.ageGroup
                    )
                )}
              </p>
            )}

            {/* If no specifications are available */}
            {!hasOrganizedMetafields &&
              Object.keys(metafieldMap).length === 0 && (
                <p>Detailed specifications not available for this product.</p>
              )}
          </div>
        </AccordionBody>
      </Accordion>

      <Accordion open={open === 3}>
        <AccordionHeader
          className="text-md font-normal text-gray-600 dark:text-gray-400 hover:text-cypress-green focus:text-cypress-green dark:focus:text-cypress-green-light focus:font-bold"
          onClick={() => handleOpen(3)}>
          Shipping & Returns
        </AccordionHeader>
        <AccordionBody className="dark:text-gray-200">
          <p>
            We offer standard shipping on all orders. Delivery times may vary
            based on your location.
          </p>
          <p className="mt-2">
            Returns accepted within 30 days of purchase. Items must be in
            original condition with tags attached.
          </p>
        </AccordionBody>
      </Accordion>
    </>
  );
}
