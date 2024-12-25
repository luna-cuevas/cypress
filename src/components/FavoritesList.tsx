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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
      {favorites.map((favorite) => (
        <div
          key={favorite.id}
          className="group relative border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-shadow duration-200">
          <Link
            href={`/shop/all/${favorite.product_handle}`}
            className="block aspect-[4/3] relative">
            <Image
              src={favorite.product_image}
              alt={favorite.product_title}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover object-center group-hover:scale-105 transition-transform duration-300"
            />
          </Link>
          <div className="p-4">
            <div className="flex justify-between items-start gap-2">
              <div className="flex-1 min-w-0">
                <Link
                  href={`/shop/all/${favorite.product_handle}`}
                  className="block">
                  <Typography className="font-medium text-gray-900 dark:text-white hover:text-cypress-green dark:hover:text-cypress-green transition-colors truncate">
                    {favorite.product_title}
                  </Typography>
                </Link>
                <Typography className="text-gray-600 dark:text-gray-400 mt-1">
                  ${favorite.product_price.toFixed(2)}
                </Typography>
              </div>
              <button
                onClick={() => removeFavorite(favorite.id)}
                className="text-gray-400 hover:text-red-500 transition-colors p-1 flex-shrink-0">
                <TrashIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
