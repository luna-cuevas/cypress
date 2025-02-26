import Link from "next/link";
import {
  getMetafieldValue,
  getHumanReadableValue,
  formatMultiValueField,
  hasOrganizedMetafields,
  getProductDetails,
  getMetafieldMap,
} from "../../utils/metafields";
import {
  findBrandInfo,
  getBrandDisplayName,
  getBrandSummary,
} from "../../utils/brandUtils";

function classNames(...classes: any[]) {
  return classes.filter(Boolean).join(" ");
}

// Component to display a single product specification
const ProductSpecification = ({
  label,
  value,
}: {
  label: string;
  value: string | null | undefined;
}) => {
  if (!value) return null;

  return (
    <p className="capitalize text-[14px] text-gray-700 dark:text-gray-300">
      <span className="font-bold  text-gray-700 dark:text-gray-500 ">
        {label}:
      </span>{" "}
      <br />
      {formatMultiValueField(value)}
    </p>
  );
};

export default function TabContent({
  product,
  selectedTab = "description",
  preserveParams = {},
}: {
  product: any;
  selectedTab?: string;
  preserveParams?: Record<string, string>;
}) {
  // Extract product details for display
  const productDetails = getProductDetails(product);

  // Extract metafield map from product metadata - handle both API structures
  const metafieldMap = getMetafieldMap(product);

  // Get brand information from the product's vendor or brand metafield
  const productVendor =
    product?.vendor || getHumanReadableValue(product, "shopify--brand");
  const brandInfo = findBrandInfo(productVendor);

  // Define available tabs
  const tabs = ["description", "about-the-brand", "highlights"];

  // Create URL with preserved parameters
  const createTabUrl = (tab: string) => {
    const params = new URLSearchParams();

    // Add the tab parameter
    params.set("tab", tab);

    // Add all preserved parameters
    Object.entries(preserveParams).forEach(([key, value]) => {
      if (key !== "tab" && value) {
        // Don't duplicate the tab parameter
        params.set(key, value);
      }
    });

    return `?${params.toString()}`;
  };

  // Helper function to get the value of a specification with fallbacks
  const getSpecificationValue = (
    namespace: string,
    key: string,
    organizedField: any
  ) => {
    return (
      getHumanReadableValue(product, `${namespace}--${key}`) ||
      (organizedField ? getMetafieldValue(organizedField) : null)
    );
  };

  // Product specifications configuration
  const specifications = [
    {
      label: "Fabric",
      value: getSpecificationValue(
        "shopify",
        "fabric",
        productDetails.organizedMetafields.fabric
      ),
    },
    {
      label: "Color/Pattern",
      value:
        getSpecificationValue(
          "shopify",
          "color-pattern",
          productDetails.organizedMetafields.colorPattern
        ) ||
        getSpecificationValue(
          "shopify",
          "color",
          productDetails.organizedMetafields.color
        ),
    },
    {
      label: "Fit",
      value: getSpecificationValue(
        "shopify",
        "fit",
        productDetails.organizedMetafields.fit
      ),
    },
    {
      label: "Sleeve Length",
      value: getSpecificationValue(
        "shopify",
        "sleeve-length-type",
        productDetails.organizedMetafields.sleeveLength
      ),
    },
    {
      label: "Top Length",
      value: getSpecificationValue(
        "shopify",
        "top-length-type",
        productDetails.organizedMetafields.topLength
      ),
    },
    {
      label: "Neckline",
      value: getSpecificationValue(
        "shopify",
        "neckline",
        productDetails.organizedMetafields.neckline
      ),
    },
    {
      label: "Pants Length",
      value: getSpecificationValue(
        "shopify",
        "pants-length-type",
        productDetails.organizedMetafields.pantsLength
      ),
    },
    {
      label: "Gender",
      value: getSpecificationValue(
        "shopify",
        "target-gender",
        productDetails.organizedMetafields.targetGender
      ),
    },
    {
      label: "Age Group",
      value: getSpecificationValue(
        "shopify",
        "age-group",
        productDetails.organizedMetafields.ageGroup
      ),
    },
  ];

  // Determine if we have any specifications to show
  const hasSpecifications =
    specifications.some((spec) => spec.value) ||
    Object.keys(metafieldMap).length > 0;

  return (
    <>
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex justify-between">
          {tabs.map((tab) => (
            <Link
              key={tab}
              href={createTabUrl(tab)}
              className={classNames(
                selectedTab === tab
                  ? "border-cypress-green text-cypress-green dark:text-cypress-green-light"
                  : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:border-gray-300 dark:hover:border-gray-600",
                "whitespace-nowrap text-center w-full py-4 px-1 border-b-2 font-medium text-base"
              )}>
              {tab === "about-the-brand" ? (
                <span className="text-center">About the brand</span>
              ) : (
                tab.charAt(0).toUpperCase() + tab.slice(1)
              )}
            </Link>
          ))}
        </nav>
      </div>
      <div className="mt-4">
        {selectedTab === "description" && (
          <div className="text-sm">
            {product?.descriptionHtml ? (
              <div
                className="text-gray-700 dark:text-gray-300 gap-2 flex flex-col"
                dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
              />
            ) : product?.description ? (
              <div
                className="text-gray-700 dark:text-gray-300"
                dangerouslySetInnerHTML={{
                  __html: product.description,
                }}
              />
            ) : (
              <p className="text-gray-700 dark:text-gray-300">
                No description found.
              </p>
            )}
          </div>
        )}
        {selectedTab === "about-the-brand" && (
          <div className="mt-4 text-gray-700 dark:text-gray-300">
            {brandInfo ? (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">
                  {getBrandDisplayName(brandInfo)}
                </h3>

                {brandInfo.foundedYear && (
                  <p className="text-sm">
                    <span className="font-medium">Established:</span>{" "}
                    {brandInfo.foundedYear}
                  </p>
                )}

                {brandInfo.location && (
                  <p className="text-sm">
                    <span className="font-medium">Origin:</span>{" "}
                    {brandInfo.location}
                  </p>
                )}

                <div className="text-sm mt-3 space-y-2">
                  {brandInfo.description.split(".").map((sentence, index) => {
                    if (!sentence.trim()) return null;
                    return <p key={index}>{sentence.trim() + "."}</p>;
                  })}
                </div>
              </div>
            ) : productVendor ? (
              <div>
                <h3 className="text-lg font-semibold">{productVendor}</h3>
                <p className="mt-2 text-sm">
                  Detailed information about this brand is not yet available.
                </p>
              </div>
            ) : (
              <p>Brand information not available for this product.</p>
            )}
          </div>
        )}
        {selectedTab === "highlights" && (
          <div className="mt-4">
            {/* Product Specifications */}
            <div className="mt-6 grid grid-cols-3 gap-4">
              {/* Display specifications using the mapping */}
              {specifications.map((spec, index) => (
                <ProductSpecification
                  key={index}
                  label={spec.label}
                  value={spec.value}
                />
              ))}

              {/* If no specifications are available */}
              {!hasSpecifications && (
                <p>Detailed specifications not available for this product.</p>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
