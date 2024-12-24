"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Motion } from "@/utils/Motion";
import AddToCartButton from "@/components/shop/AddToCartButton";
import { useRouter } from "next/navigation";
import { useCustomerSession } from "@/hooks/useCustomerSession";

type FavoriteProduct = {
  id: string;
  handle: string;
  title: string;
  description: string;
  images: {
    edges: Array<{
      node: {
        url: string;
        altText: string;
      };
    }>;
  };
  variants: Array<{
    variantId: string;
    variantTitle: string;
    variantPrice: string;
    variantQuantityAvailable: number;
  }>;
};

export default function FavoritesPage() {
  const { isAuthenticated, customer } = useCustomerSession();
  const [favoriteProducts, setFavoriteProducts] = useState<FavoriteProduct[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchFavorites = async () => {
      if (!isAuthenticated) {
        router.push("https://shopify.com/69307498727/account");
        return;
      }

      try {
        // Fetch favorite product IDs
        const favoritesResponse = await fetch(
          `/api/favorites?customerId=${customer?.id}`
        );
        const { favorites } = await favoritesResponse.json();

        if (favorites.length === 0) {
          setLoading(false);
          return;
        }

        // Fetch product details for each favorite
        const productsQuery = `
          query getProducts($ids: [ID!]!) {
            nodes(ids: $ids) {
              ... on Product {
                id
                handle
                title
                description
                images(first: 1) {
                  edges {
                    node {
                      url
                      altText
                    }
                  }
                }
                variants(first: 10) {
                  edges {
                    node {
                      id
                      title
                      price {
                        amount
                      }
                      quantityAvailable
                    }
                  }
                }
              }
            }
          }
        `;

        const productsResponse = await fetch("/api/fetchProducts", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            query: productsQuery,
            variables: {
              ids: favorites,
            },
          }),
        });

        const productsData = await productsResponse.json();
        setFavoriteProducts(productsData.data.nodes);
      } catch (error) {
        console.error("Error fetching favorites:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [isAuthenticated, customer?.id, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cypress-green"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Router will handle redirect
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 !font-['trajan']">
          My Favorites
        </h1>

        {favoriteProducts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              You haven&apos;t added any products to your favorites yet.
            </p>
            <Link
              href="/shop"
              className="text-cypress-green hover:text-cypress-green-light transition-colors">
              Start shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8">
            {favoriteProducts.map((product) => (
              <Motion
                key={product.id}
                type="div"
                className="group relative"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}>
                <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-900">
                  <Link href={`/shop/${product.handle}`}>
                    <Image
                      src={
                        product.images.edges[0]?.node.url || "/placeholder.jpg"
                      }
                      alt={
                        product.images.edges[0]?.node.altText || product.title
                      }
                      width={500}
                      height={500}
                      className="h-full w-full object-cover object-center"
                    />
                  </Link>
                </div>

                <div className="mt-4 flex flex-col">
                  <h2 className="text-lg font-medium text-gray-900 dark:text-white !font-['trajan']">
                    <Link href={`/shop/${product.handle}`}>
                      {product.title}
                    </Link>
                  </h2>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    {product.variants[0]?.variantTitle}
                  </p>
                  <p className="mt-1 text-lg font-medium text-gray-900 dark:text-white">
                    ${parseFloat(product.variants[0]?.variantPrice).toFixed(2)}
                  </p>

                  <div className="mt-4">
                    <AddToCartButton
                      product={product}
                      selectedVariant={product.variants[0]}
                    />
                  </div>

                  <Link
                    href={`/shop/${product.handle}`}
                    className="mt-2 text-sm text-center text-cypress-green hover:text-cypress-green-light transition-colors">
                    View Details
                  </Link>
                </div>
              </Motion>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
