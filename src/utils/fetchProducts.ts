// // Define the type for a product to improve code readability and maintenance
// type Product = {
//   id: string;
//   handle: string;
//   productType: string;
//   title: string;
//   description: string;
//   variants: any[];
//   images: { src: string; altText: string }[];
// };

// // Function to optimize image URLs
// const optimizeImage = (
//   src: string,
//   width: number,
//   height: number,
//   format = "webp"
// ) => {
//   return `${src}?width=${width}&height=${height}&format=${format}`;
// };

// // Main function to fetch and optimize products
// const fetchProducts = async (category: string) => {
//   const baseURL = process.env.BASE_URL;
//   console.log("category from fetchProducts", category);

//   // Dynamically construct the productQuery to include a filter for productType if a category is provided
//   const productQuery = `
//     query {
//       products(first: 10${
//         category ? `, where: { productType: "${category}" }` : ""
//       }) {
//         edges {
//           node {
//             id
//             handle
//             title
//             description
//             productType
//             variants(first: 10) {
//               edges {
//                 node {
//                   id
//                   title
//                   quantityAvailable
//                   price {
//                     amount
//                     currencyCode
//                   }
//                 }
//               }
//             }
//             images(first: 1) {
//               edges {
//                 node {
//                   src
//                   altText
//                 }
//               }
//             }
//           }
//         }
//       }
//     }
//   `;

//   if (!response.ok) {
//     throw new Error(`HTTP error! status: ${response.status}`);
//   }

//   const data = await response.json();
//   const products: Product[] = data.products;

//   if (!products) {
//     return products;
//   }

//   return products;
// };

// export default fetchProducts;
