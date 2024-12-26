"use client";
import { useState, useEffect } from "react";
import { useSupabase } from "@/lib/supabase";
import StarRating from "./StarRating";
import { Database } from "@/types/supabase";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { useAtom } from "jotai";
import { globalStateAtom } from "@/context/atoms";

interface Review {
  id: string;
  user_id: string;
  product_id: string;
  rating: number;
  review_text: string;
  created_at: string;
  user_email?: string;
  name?: string;
}

interface ProductReviewsProps {
  productId: string;
}

export default function ProductReviews({ productId }: ProductReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [averageRating, setAverageRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [newRating, setNewRating] = useState(0);
  const [newReview, setNewReview] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userReview, setUserReview] = useState<Review | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const supabase = useSupabase();
  const [state, setState] = useAtom(globalStateAtom);
  const { user } = useAuth();

  useEffect(() => {
    fetchReviews();
    fetchProductRating();
  }, [productId]);

  async function fetchReviews() {
    const { data: reviewsData, error } = await supabase
      .from("product_reviews")
      .select(
        `
        *
      `
      )
      .eq("product_id", productId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching reviews:", error);
      return;
    }

    setReviews(reviewsData);

    if (user) {
      const userReview = reviewsData.find(
        (review: Review) => review.user_id === user.id
      );
      if (userReview) {
        setUserReview(userReview);
        setNewRating(userReview.rating);
        setNewReview(userReview.review_text);
      }
    }
  }

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

  async function handleSubmitReview(e: React.FormEvent) {
    e.preventDefault();
    if (!user || !newRating) return;

    setIsSubmitting(true);

    const reviewData = {
      name: state.user.user_metadata.first_name,
      user_id: user.id,
      product_id: productId,
      rating: newRating,
      review_text: newReview.trim(),
    };

    let error;
    if (userReview) {
      const { error: updateError } = await supabase
        .from("product_reviews")
        .update(reviewData)
        .eq("id", userReview.id);
      error = updateError;
    } else {
      const { error: insertError } = await supabase
        .from("product_reviews")
        .insert(reviewData);
      error = insertError;
    }

    if (error) {
      console.error("Error submitting review:", error);
    } else {
      fetchReviews();
      fetchProductRating();
      if (!userReview) {
        setNewRating(0);
        setNewReview("");
      }
      setIsEditing(false);
    }

    setIsSubmitting(false);
  }

  function formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="border-gray-200 dark:border-gray-800">
        <div className="py-8">
          {/* Header and Summary */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-16">
            <h2 className="text-2xl font-light text-gray-900 dark:text-white mb-4 sm:mb-0">
              Customer Reviews
            </h2>
            <div className="flex items-center gap-4">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-light text-gray-900 dark:text-white">
                  {averageRating.toFixed(1)}
                </span>
                <StarRating rating={averageRating} size="lg" />
              </div>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {totalReviews} review{totalReviews !== 1 ? "s" : ""}
              </span>
            </div>
          </div>

          {/* Review Form */}
          {user ? (
            <div className="mb-16">
              {userReview ? (
                <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-6 mb-4">
                  {!isEditing ? (
                    <>
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Your Review
                        </h3>
                        <button
                          onClick={() => setIsEditing(true)}
                          className="text-sm text-cypress-green hover:text-cypress-green-dark 
                            dark:text-cypress-green-light dark:hover:text-cypress-green transition-colors">
                          Edit Review
                        </button>
                      </div>
                      <div className="space-y-2">
                        <StarRating rating={userReview.rating} size="md" />
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {userReview.review_text}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-500">
                          Posted on {formatDate(userReview.created_at)}
                        </p>
                      </div>
                    </>
                  ) : (
                    <form onSubmit={handleSubmitReview}>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Edit Your Review
                          </h3>
                          <button
                            type="button"
                            onClick={() => setIsEditing(false)}
                            className="text-sm text-gray-500 hover:text-gray-700 
                              dark:text-gray-400 dark:hover:text-gray-200 transition-colors">
                            Cancel
                          </button>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Rating
                          </label>
                          <StarRating
                            rating={newRating}
                            editable
                            onChange={setNewRating}
                            size="lg"
                          />
                        </div>
                        <div>
                          <label
                            htmlFor="edit-review"
                            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Review
                          </label>
                          <textarea
                            id="edit-review"
                            rows={4}
                            value={newReview}
                            onChange={(e) => setNewReview(e.target.value)}
                            className="block w-full rounded-md border-gray-300 dark:border-gray-700 
                              shadow-sm focus:border-cypress-green dark:focus:border-cypress-green-light 
                              focus:ring-cypress-green dark:focus:ring-cypress-green-light sm:text-sm
                              bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                            placeholder="Update your review..."
                          />
                        </div>
                        <div className="flex justify-end">
                          <button
                            type="submit"
                            disabled={isSubmitting}
                            className="inline-flex justify-center rounded-md border border-transparent 
                              bg-cypress-green dark:bg-cypress-green-light px-4 py-2 text-sm 
                              font-medium text-white shadow-sm hover:bg-cypress-green-dark 
                              focus:outline-none focus:ring-2 focus:ring-cypress-green 
                              dark:focus:ring-cypress-green-light focus:ring-offset-2 
                              disabled:opacity-50 disabled:cursor-not-allowed">
                            {isSubmitting ? "Updating..." : "Update Review"}
                          </button>
                        </div>
                      </div>
                    </form>
                  )}
                </div>
              ) : (
                <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-6">
                  <form onSubmit={handleSubmitReview}>
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Your Rating
                        </label>
                        <StarRating
                          rating={newRating}
                          editable
                          onChange={setNewRating}
                          size="lg"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="review"
                          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Your Review
                        </label>
                        <textarea
                          id="review"
                          rows={4}
                          value={newReview}
                          onChange={(e) => setNewReview(e.target.value)}
                          className="block w-full rounded-md border-gray-300 dark:border-gray-700 
                            shadow-sm focus:border-cypress-green dark:focus:border-cypress-green-light 
                            focus:ring-cypress-green dark:focus:ring-cypress-green-light sm:text-sm
                            bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition-colors
                            placeholder:text-gray-400 dark:placeholder:text-gray-500"
                          placeholder="Share your thoughts about this product..."
                        />
                      </div>
                      <div className="flex justify-end">
                        <button
                          type="submit"
                          disabled={isSubmitting || !newRating}
                          className="inline-flex justify-center rounded-md border border-transparent 
                            bg-cypress-green dark:bg-cypress-green-light px-6 py-2.5 text-sm font-medium 
                            text-white shadow-sm hover:bg-cypress-green-dark focus:outline-none 
                            focus:ring-2 focus:ring-cypress-green dark:focus:ring-cypress-green-light 
                            focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed
                            transition-all duration-200">
                          {isSubmitting ? "Submitting..." : "Submit Review"}
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-6 mb-12 text-center">
              <Link
                href="/login"
                className="text-sm text-gray-500 dark:text-gray-400">
                Please <span className="text-cypress-green">sign in</span> to
                leave a review.
              </Link>
            </div>
          )}

          {/* Reviews List */}
          <div className="space-y-5">
            {reviews.length > 0 ? (
              reviews.map((review) => (
                <div
                  key={review.id}
                  className="border-t px-4 border-gray-200 dark:border-gray-800 pt-4">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
                    <div className="flex flex-col items-start gap-3">
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {review.name || "Anonymous"}
                      </span>
                      <StarRating rating={review.rating} size="sm" />
                    </div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {formatDate(review.created_at)}
                    </span>
                  </div>
                  <div className="prose prose-sm dark:prose-invert max-w-none">
                    <p className="text-gray-700 dark:text-gray-300">
                      {review.review_text}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500 dark:text-gray-400">
                  No reviews yet. Be the first to review this product!
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
