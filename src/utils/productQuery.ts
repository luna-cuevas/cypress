// utils/productQuery.ts
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
}: {
  category?: string;
  sizes?: string[];
  sort?: Sort;
}) => {
  // Construct the size query part
  let sizeQuery = "";
  if (Array.isArray(sizes)) {
    sizeQuery = sizes.map((size) => `title:${size}`).join(" OR ");
  } else if (sizes) {
    sizeQuery = `title:${sizes}`;
  }

  // Combine the category and size query parts
  const combinedQuery = [
    category ? `product_type:${category}` : null,
    sizeQuery ? `(${sizeQuery})` : null,
  ]
    .filter(Boolean)
    .join(" AND ");

  console.log("combinedQuery", combinedQuery);

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

  return `
    query {
      products(first: 10, query: "${combinedQuery}", reverse: ${reverse}, sortKey: ${sortKey}) {
        edges {
          node {
            id
            handle
            title
            description
            productType
            variants(first: 10) {
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
