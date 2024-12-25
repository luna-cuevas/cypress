"use client";

import { useState, useEffect } from "react";
import { HeartIcon } from "@heroicons/react/24/outline";
import { HeartIcon as HeartIconSolid } from "@heroicons/react/24/solid";
import { useAuth } from "@/context/AuthContext";
import { useSupabase } from "@/lib/supabase";

interface FavoriteButtonProps {
  productId: string;
  productTitle: string;
  productImage: string;
  productPrice: string | number;
  productHandle: string;
}

export default function FavoriteButton({
  productId,
  productTitle,
  productImage,
  productPrice,
  productHandle,
}: FavoriteButtonProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const supabase = useSupabase();

  // Convert price to number and handle empty or invalid values
  const normalizedPrice =
    typeof productPrice === "string"
      ? parseFloat(productPrice) || 0
      : productPrice || 0;

  useEffect(() => {
    const checkFavoriteStatus = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from("favorites")
          .select("id")
          .eq("user_id", user.id)
          .eq("product_id", productId)
          .single();

        if (error && error.code !== "PGRST116") {
          console.error("Error checking favorite status:", error);
        }

        setIsFavorite(!!data);
      } catch (err) {
        console.error("Error checking favorite status:", err);
      } finally {
        setIsLoading(false);
      }
    };

    checkFavoriteStatus();
  }, [user, productId, supabase]);

  const toggleFavorite = async () => {
    if (!user) {
      // Redirect to login or show login modal
      window.location.href = "/login";
      return;
    }

    try {
      if (isFavorite) {
        // Remove from favorites
        const { error } = await supabase
          .from("favorites")
          .delete()
          .eq("user_id", user.id)
          .eq("product_id", productId);

        if (error) throw error;
        setIsFavorite(false);
      } else {
        // Add to favorites
        const { error } = await supabase.from("favorites").insert({
          user_id: user.id,
          product_id: productId,
          product_title: productTitle,
          product_image: productImage,
          product_price: normalizedPrice,
          product_handle: productHandle,
        });

        if (error) throw error;
        setIsFavorite(true);
      }
    } catch (err) {
      console.error("Error toggling favorite:", err);
    }
  };

  if (isLoading) {
    return (
      <button
        disabled
        className="p-2 rounded-full bg-white/80 backdrop-blur-sm shadow-md">
        <HeartIcon className="h-5 w-5 text-gray-400 animate-pulse" />
      </button>
    );
  }

  return (
    <button
      onClick={toggleFavorite}
      className="p-2 rounded-full bg-white/80 backdrop-blur-sm shadow-md hover:bg-white transition-colors">
      {isFavorite ? (
        <HeartIconSolid className="h-5 w-5 text-red-500" />
      ) : (
        <HeartIcon className="h-5 w-5 text-gray-600" />
      )}
    </button>
  );
}
