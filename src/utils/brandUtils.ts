import brandData from "../data/brands.json";

interface Brand {
  name: string;
  description: string;
  foundedYear: number | null;
  location: string | null;
}

/**
 * Finds brand information by matching the product's vendor or brand name
 * @param productVendor The vendor or brand name from the product
 * @returns Brand information if found, or null if not found
 */
export const findBrandInfo = (
  productVendor: string | null | undefined
): Brand | null => {
  if (!productVendor) return null;

  // Normalize the product vendor name for comparison
  const normalizedVendor = productVendor.toLowerCase().trim();

  // Try to find an exact match first
  let brand = brandData.brands.find(
    (brand) => brand.name.toLowerCase() === normalizedVendor
  );

  // If no exact match, try to find a partial match
  if (!brand) {
    brand = brandData.brands.find(
      (brand) =>
        normalizedVendor.includes(brand.name.toLowerCase()) ||
        brand.name.toLowerCase().includes(normalizedVendor)
    );
  }

  return brand || null;
};

/**
 * Gets a formatted brand display name and location
 * @param brand Brand information
 * @returns Formatted string with brand name and location (if available)
 */
export const getBrandDisplayName = (brand: Brand): string => {
  if (!brand) return "";

  return brand.name;
};

/**
 * Gets a summary of the brand, including founded year if available
 * @param brand Brand information
 * @returns Brief brand summary
 */
export const getBrandSummary = (brand: Brand): string => {
  if (!brand) return "";

  let summary = "";

  if (brand.foundedYear) {
    summary += `Established in ${brand.foundedYear}. `;
  }

  // Get the first sentence of the description as a summary
  const firstSentence = brand.description.split(".")[0];
  if (firstSentence) {
    summary += firstSentence + ".";
  }

  return summary;
};
