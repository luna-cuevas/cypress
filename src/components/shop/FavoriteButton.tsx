"use client";
import { globalStateAtom } from "@/context/atoms";
import { useAtom } from "jotai";
import { HeartIcon } from "@heroicons/react/24/outline";
import { HeartIcon as HeartIconSolid } from "@heroicons/react/24/solid";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { useCustomerSession } from "@/hooks/useCustomerSession";

type Props = {
  productId: string;
  className?: string;
};

const FavoriteButton = ({ productId, className = "" }: Props) => {
  const [state, setState] = useAtom(globalStateAtom);
  const router = useRouter();
  const { isAuthenticated, customer } = useCustomerSession();

  const isFavorite = state.favorites.includes(productId);

  const toggleFavorite = async () => {
    try {
      if (!isAuthenticated) {
        // Redirect to Shopify account login
        const shopifyAccountUrl = `https://shopify.com/69307498727/account`;
        router.push(shopifyAccountUrl);
        return;
      }

      const action = isFavorite ? "remove" : "add";
      const response = await fetch("/api/favorites", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customerId: customer?.id,
          productId,
          action,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update favorites");
      }

      const { favorites } = await response.json();

      // Update local state
      setState({
        ...state,
        favorites,
      });

      toast.success(
        isFavorite ? "Removed from favorites" : "Added to favorites",
        {
          position: "bottom-right",
          autoClose: 2000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          className: "dark:bg-gray-800 dark:text-white",
        }
      );
    } catch (error) {
      console.error("Error updating favorites:", error);
      toast.error("Failed to update favorites", {
        position: "bottom-right",
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        className: "dark:bg-gray-800 dark:text-white",
      });
    }
  };

  return (
    <button
      type="button"
      onClick={toggleFavorite}
      className={`transition-all duration-200 focus:outline-none ${className}`}
      aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}>
      {isFavorite ? (
        <HeartIconSolid className="size-6 text-red-500 hover:text-red-600" />
      ) : (
        <HeartIcon className="size-6 text-gray-600 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-500" />
      )}
    </button>
  );
};

export default FavoriteButton;
