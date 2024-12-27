"use client";

import React, { useEffect, useState } from "react";
import { Typography } from "@material-tailwind/react";
import Image from "next/image";
import Link from "next/link";
import { useSupabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";
import { TrashIcon } from "@heroicons/react/24/outline";

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
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-cypress-green"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <Typography className="text-red-500">{error}</Typography>
      </div>
    );
  }

  if (favorites.length === 0) {
    return (
      <div className="text-center py-8">
        <Typography className="text-gray-600 dark:text-gray-400">
          No favorites found.
        </Typography>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
      {favorites.map((favorite) => (
        <div
          key={favorite.id}
          className="group relative"
          data-test-id="wishlist--product-card">
          <div className="relative overflow-hidden bg-gray-100 dark:bg-gray-800 aspect-[3/4] rounded-lg">
            {/* Remove Button */}
            <button
              onClick={() => removeFavorite(favorite.id)}
              className="absolute top-2 right-2 z-20 p-2 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-sm transition-all duration-200 hover:scale-110"
              aria-label="Remove from favorites">
              <TrashIcon className="h-4 w-4 text-white hover:text-cypress-green-light" />
            </button>

            {/* Product Image */}
            <Link
              href={`/shop/all/${favorite.product_handle}`}
              className="block">
              <div className="absolute inset-0 bg-black/5">
                <Image
                  src={favorite.product_image}
                  alt={favorite.product_title}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 25vw"
                  className="object-cover object-center transition-transform duration-300 group-hover:scale-105"
                />
              </div>
            </Link>
          </div>

          {/* Product Info */}
          <div className="mt-4 space-y-1">
            <Link
              href={`/shop/all/${favorite.product_handle}`}
              className="block group/title">
              <h3 className="text-sm font-medium text-gray-900 dark:text-white group-hover/title:text-cypress-green dark:group-hover/title:text-cypress-green-light transition-colors line-clamp-1">
                {favorite.product_title}
              </h3>
            </Link>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              ${favorite.product_price.toFixed(2)}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
