type Sort =
  | "id"
  | "relevance"
  | "price_asc"
  | "price_desc"
  | "created_at"
  | "best_selling";

export const productQuery = ({
  category,
  sizes,
  sort,
  handle,
}: {
  category?: string;
  sizes?: string[];
  sort?: Sort;
  handle?: string;
}) => {
  let sizeQuery = "";
  if (Array.isArray(sizes)) {
    sizeQuery = sizes.map((size) => `variant.option:${size}`).join(" OR ");
  } else if (sizes) {
    sizeQuery = `variant.option:${sizes}`;
  }

  const combinedQuery = [
    category ? `product_type:${category}` : null,
    sizeQuery ? `(${sizeQuery})` : null,
  ]
    .filter(Boolean)
    .join(" AND ");

  const determineSortParams = (sort: Sort) => {
    let sortKey;
    let reverse;

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
        reverse = true;
        break;
      case "id":
        sortKey = "ID";
        reverse = false;
        break;
      default:
        sortKey = "RELEVANCE";
        reverse = false;
    }

    return { sortKey, reverse };
  };

  const { sortKey, reverse } = determineSortParams(sort || "relevance");

  if (handle) {
    return `
      query {
        product(handle: "${handle}") {
          id
          handle
          title
          description
          productType
          tags
          variants(first: 20) {
            edges {
              node {
                id
                title
                quantityAvailable
                price {
                  amount
                  currencyCode
                }
              }
            }
          }
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
  }

  return `
    query {
      products(first: 20, query: "${combinedQuery}", reverse: ${reverse}, sortKey: ${sortKey}) {
        edges {
          node {
            id
            handle
            title
            description
            productType
            tags
            variants(first: 20) {
              edges {
                node {
                  id
                  title
                  quantityAvailable
                  price {
                    amount
                    currencyCode
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
};
