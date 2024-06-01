import { shopifyClient } from "../lib/shopify";
import { useEffect } from "react";

export default function Home() {
  // const fetchProducts = async () => {
  //   const productQuery = `
  //     query getProductsAndVariants {
  //       products(first: 5) {
  //         edges {
  //           node {
  //             id
  //             title
  //             description
  //             handle
  //             variants(first: 3) {
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
  //           }
  //         }
  //       }
  //     }
  //   `;

  //   const data = await fetch("/api/fetchProducts", {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify({
  //       productQuery,
  //     }),
  //   }).then((res) => res.json());
  //   console.log(data);
  // };

  // useEffect(() => {
  //   fetchProducts();
  // }, []);
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24"></main>
  );
}
