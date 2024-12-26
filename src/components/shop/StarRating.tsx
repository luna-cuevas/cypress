import { useState } from "react";
import { StarIcon } from "@heroicons/react/24/solid";
import { StarIcon as StarOutline } from "@heroicons/react/24/outline";

interface StarRatingProps {
  rating?: number;
  editable?: boolean;
  onChange?: (rating: number) => void;
  size?: "sm" | "md" | "lg";
}

export default function StarRating({
  rating = 0,
  editable = false,
  onChange,
  size = "md",
}: StarRatingProps) {
  const [hoverRating, setHoverRating] = useState(0);

  const sizes = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  };

  const sizeClass = sizes[size];

  return (
    <div className="flex items-center gap-[1px]">
      {[1, 2, 3, 4, 5].map((star) => {
        const isFilled = editable
          ? star <= (hoverRating || rating)
          : star <= rating;

        return (
          <button
            key={star}
            type={editable ? "button" : "submit"}
            disabled={!editable}
            className={`${editable ? "cursor-pointer" : "cursor-default"} 
              text-yellow-400 hover:text-yellow-500 transition-colors`}
            onClick={() => onChange?.(star)}
            onMouseEnter={() => editable && setHoverRating(star)}
            onMouseLeave={() => editable && setHoverRating(0)}>
            {isFilled ? (
              <StarIcon className={sizeClass} />
            ) : (
              <StarOutline className={sizeClass} />
            )}
          </button>
        );
      })}
    </div>
  );
}
