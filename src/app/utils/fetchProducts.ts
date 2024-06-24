// Define the type for a product to improve code readability and maintenance
type Product = {
  id: string;
  handle: string;
  title: string;
  description: string;
  variants: any[];
  images: { src: string; altText: string }[];
};

// Function to optimize image URLs
const optimizeImage = (
  src: string,
  width: number,
  height: number,
  format = "webp"
) => {
  return `${src}?width=${width}&height=${height}&format=${format}`;
};

// Main function to fetch and optimize products
const fetchProducts = async () => {
  const baseURL = process.env.BASE_URL;
  const response = await fetch(`${baseURL}/api/fetchProducts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      productQuery: `
        query {
          products(first: 10) {
            edges {
              node {
                id
                handle
                title
                description
                handle
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
      `,
    }),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  const products: Product[] = data.products;

  // Optimize product images
  const optimizedProducts = products.map((product) => ({
    ...product,
    images: product.images.map((image) => ({
      ...image,
      src: optimizeImage(image.src, 800, 800), // Adjust width and height as needed
    })),
  }));

  return optimizedProducts;
};

export default fetchProducts;
