"use client";

import { useState, useEffect } from "react";
import { HeartIcon } from "@heroicons/react/24/outline";
import { HeartIcon as HeartIconSolid } from "@heroicons/react/24/solid";
import { useAuth } from "@/context/AuthContext";

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

  // Convert price to number and handle empty or invalid values
  const normalizedPrice =
    typeof productPrice === "string"
      ? parseFloat(productPrice) || 0
      : productPrice || 0;

  useEffect(() => {
    const fetchFavoriteStatus = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `/api/shop/favorites?userId=${user.id}&productId=${productId}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch favorite status");
        }

        const data = await response.json();
        setIsFavorite(data.isFavorite);
      } catch (err) {
        console.error("Error checking favorite status:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFavoriteStatus();
  }, [user, productId]);

  const toggleFavorite = async () => {
    if (!user) {
      // Redirect to login or show login modal
      window.location.href = "/login";
      return;
    }

    try {
      if (isFavorite) {
        // Remove from favorites
        const response = await fetch(
          `/api/shop/favorites?userId=${user.id}&productId=${productId}`,
          {
            method: "DELETE",
          }
        );

        if (!response.ok) {
          throw new Error("Failed to remove from favorites");
        }

        setIsFavorite(false);
      } else {
        // Add to favorites
        const response = await fetch("/api/shop/favorites", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: user.id,
            productId,
            productTitle,
            productImage,
            productPrice: normalizedPrice,
            productHandle,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to add to favorites");
        }

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
        className="p-2 rounded-full bg-white/40 backdrop-blur-sm shadow-md">
        <HeartIcon className="h-5 w-5 text-gray-400 animate-pulse" />
      </button>
    );
  }

  return (
    <button
      onClick={toggleFavorite}
      className="p-2 rounded-full dark:shadow-white/10 dark:border-gray-800 border-2 backdrop-blur-sm shadow-md hover:bg-white transition-colors">
      {isFavorite ? (
        <HeartIconSolid className="h-5 w-5 text-red-500" />
      ) : (
        <HeartIcon className="h-5 w-5 text-gray-600 dark:text-white" />
      )}
    </button>
  );
}
