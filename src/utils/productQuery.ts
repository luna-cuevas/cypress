export const productQuery = ({
  sizes = [],
  sort,
  vendors = [],
  handle,
  category,
}: {
  sizes?: string[];
  sort?: string;
  vendors?: string[];
  handle?: string;
  category?: string;
}) => {
  // If handle is provided, return single product query
  if (handle) {
    return `
      query {
        product(handle: "${handle}") {
          id
          title
          vendor
          handle
          description
          descriptionHtml
          productType
          variants(first: 20) {
            edges {
              node {
                id
                title
                price {
                  amount
                  currencyCode
                }
                quantityAvailable
              }
            }
          }
          images(first: 20) {
            edges {
              node {
                src
                altText
              }
            }
          }
        }
        products(first: 5, query: "vendor:\\"$vendor\\"") {
          edges {
            node {
              id
              title
              vendor
              handle
              description
              descriptionHtml
              productType
              variants(first: 1) {
                edges {
                  node {
                    price {
                      amount
                    }
                  }
                }
              }
              images(first: 1) {
                edges {
                  node {
                    src
                    altText
                  }
                }
              }
            }
          }
        }
      }
    `;
  }

  // Build filter conditions
  const conditions: string[] = [];

  if (category) {
    conditions.push(`(product_type:${category})`);
  }

  if (sizes.length > 0) {
    const sizeFilter = sizes.map((size) => `(variant:${size})`).join(" OR ");
    conditions.push(`(${sizeFilter})`);
  }

  if (vendors.length > 0) {
    const vendorFilter = vendors
      .map((vendor) => `(vendor:${vendor})`)
      .join(" OR ");
    conditions.push(`(${vendorFilter})`);
  }

  const filterCondition = conditions.length > 0 ? conditions.join(" AND ") : "";

  // Determine sort key and direction
  let sortKey = "RELEVANCE";
  let reverse = false;

  switch (sort) {
    case "price_asc":
      sortKey = "PRICE";
      reverse = false;
      break;
    case "price_desc":
      sortKey = "PRICE";
      reverse = true;
      break;
    case "created_at":
      sortKey = "CREATED_AT";
      reverse = true;
      break;
    case "best_selling":
      sortKey = "BEST_SELLING";
      reverse = false;
      break;
    default:
      sortKey = "RELEVANCE";
      reverse = false;
  }

  return `
    query {
      products(
        first: 250
        ${filterCondition ? `query: "${filterCondition}"` : ""}
        sortKey: ${sortKey}
        reverse: ${reverse}
      ) {
        edges {
          node {
            id
            title
            vendor
            handle
            description
            descriptionHtml
            productType
            variants(first: 20) {
              edges {
                node {
                  id
                  title
                  price {
                    amount
                    currencyCode
                  }
                  quantityAvailable
                }
              }
            }
            images(first: 20) {
              edges {
                node {
                  src
                  altText
                }
              }
            }
          }
        }
      }
    }
  `;
};
