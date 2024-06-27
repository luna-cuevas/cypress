export const productQuery = (category?: string) => `
  query {
    products(first: 10${
      category ? `, query: "product_type:${category}"` : ""
    }) {
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
