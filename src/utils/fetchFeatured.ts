export const fetchFeatured = () => {
  return `
    query {
      collectionByHandle(handle: "featured") {
        id
        title
        description
        products(first: 10) {
          edges {
            node {
              id
              handle
              title
              description
              productType
              tags
              collections(first: 10) {
                edges {
                  node {
                    id
                    title
                  }
                }
              }
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
    }
  `;
};
