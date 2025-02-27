"use client";

import React, { useEffect, useState } from "react";
import { Typography } from "@material-tailwind/react";
import Image from "next/image";
import Link from "next/link";
import { useSupabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";
import {
  XMarkIcon,
  HeartIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";
import { Motion } from "@/utils/Motion";

type Favorite = {
  id: string;
  product_id: string;
  product_title: string;
  product_image: string;
  product_price: number;
  product_handle: string;
};

export default function FavoritesList() {
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = useSupabase();
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    const fetchFavorites = async () => {
      try {
        const { data, error: favoritesError } = await supabase
          .from("favorites")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        if (favoritesError) throw favoritesError;
        setFavorites(data || []);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch favorites"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [user, supabase]);

  const removeFavorite = async (favoriteId: string) => {
    try {
      const { error } = await supabase
        .from("favorites")
        .delete()
        .eq("id", favoriteId);

      if (error) throw error;

      setFavorites((prev) => prev.filter((fav) => fav.id !== favoriteId));
    } catch (err) {
      console.error("Error removing favorite:", err);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-cypress-green border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-16">
        <Typography className="text-red-500">{error}</Typography>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 text-cypress-green hover:text-cypress-green-light font-medium">
          Try Again
        </button>
      </div>
    );
  }

  if (favorites.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-6">
        <div className="p-6 border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50 rounded-full mb-6">
          <HeartIcon className="w-12 h-12 text-gray-300 dark:text-gray-600" />
        </div>
        <Typography
          variant="h6"
          className="mb-2 text-gray-900 dark:text-white font-light">
          Your Collection is Empty
        </Typography>
        <Typography className="text-gray-600 dark:text-gray-400 max-w-md mb-8">
          Items you save to your favorites will appear here. Start building your
          wishlist by browsing our collection.
        </Typography>
        <Link
          href="/shop"
          className="group inline-flex items-center text-sm font-medium text-cypress-green hover:text-cypress-green-light transition-colors duration-200">
          <span>Explore Products</span>
          <ChevronRightIcon className="ml-1 w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-200" />
        </Link>
      </div>
    );
  }

  return (
    <div className="py-2">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
        {favorites.map((favorite, index) => (
          <Motion
            key={favorite.id}
            type="div"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            className="group relative"
            data-test-id="wishlist--product-card">
            <div className="relative overflow-hidden aspect-[3/4] rounded-md bg-gray-50 dark:bg-gray-900">
              {/* Remove Button */}
              <button
                onClick={() => removeFavorite(favorite.id)}
                className="absolute top-3 right-3 z-20 p-2 bg-white/80 dark:bg-black/60 backdrop-blur-sm hover:bg-white dark:hover:bg-black shadow-sm rounded-full transition-all duration-200"
                aria-label="Remove from favorites">
                <XMarkIcon className="h-4 w-4 text-gray-600 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-400" />
              </button>

              {/* Product Image */}
              <Link
                href={`/shop/all/${favorite.product_handle}`}
                className="block h-full">
                <div className="h-full">
                  <Image
                    src={favorite.product_image}
                    alt={favorite.product_title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
              </Link>
            </div>

            {/* Product Info */}
            <div className="mt-4 space-y-1">
              <Link
                href={`/shop/all/${favorite.product_handle}`}
                className="block group/title">
                <h3 className="text-sm font-medium text-gray-900 dark:text-white transition-colors duration-200 group-hover/title:text-cypress-green dark:group-hover/title:text-cypress-green-light">
                  {favorite.product_title}
                </h3>
              </Link>
              <p className="text-sm text-gray-500 dark:text-gray-400 font-light">
                ${favorite.product_price.toFixed(2)}
              </p>
              <div className="pt-2">
                <Link
                  href={`/shop/all/${favorite.product_handle}`}
                  className="text-xs text-cypress-green hover:text-cypress-green-light font-medium inline-flex items-center transition-colors duration-200">
                  <span>View Product</span>
                  <ChevronRightIcon className="ml-1 w-3 h-3" />
                </Link>
              </div>
            </div>
          </Motion>
        ))}
      </div>
    </div>
  );
}
