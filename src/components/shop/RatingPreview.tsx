"use client";
import { useEffect, useState } from "react";
import { useSupabase } from "@/lib/supabase";
import StarRating from "./StarRating";

interface RatingPreviewProps {
  productId: string;
}

export default function RatingPreview({ productId }: RatingPreviewProps) {
  const [averageRating, setAverageRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const supabase = useSupabase();

  useEffect(() => {
    async function fetchProductRating() {
      const { data, error } = await supabase.rpc("get_product_rating", {
        product_id: productId,
      });

      if (error) {
        console.error("Error fetching product rating:", error);
        return;
      }

      if (data && data[0]) {
        setAverageRating(data[0].average_rating || 0);
        setTotalReviews(data[0].total_reviews || 0);
      }
    }

    fetchProductRating();
  }, [productId]);

  if (!totalReviews) return null;

  return (
    <div className="flex items-center gap-2">
      <StarRating rating={averageRating} size="sm" />
      <span className="text-sm text-gray-500 dark:text-gray-400">
        ({totalReviews})
      </span>
    </div>
  );
}
