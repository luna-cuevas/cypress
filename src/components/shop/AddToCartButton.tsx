"use client";
import { globalStateAtom } from "@/context/atoms";
import { useAtom } from "jotai";
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";

type Props = {
  product: any;
  selectedVariant: any;
  closeBox?: any;
};

const AddToCartButton = (props: Props) => {
  const [state, setState] = useAtom(globalStateAtom);
  const { product, selectedVariant, closeBox } = props;
  const [showSizeRequired, setShowSizeRequired] = useState(false);

  // Reset error message when variant is selected
  useEffect(() => {
    if (selectedVariant) {
      setShowSizeRequired(false);
    }
  }, [selectedVariant]);

  // Helper function to map cart lines from Shopify to local state
  const mapCartLine = (edge: any) => {
    const line = edge.node;
    const merchandise = line.merchandise;
    const product = merchandise.product;
    const image = product.images.edges[0]?.node;

    return {
      lineId: line.id,
      quantity: line.quantity,
      product: {
        id: product.id,
        handle: product.handle,
        title: product.title,
        images: [
          {
            altText: image?.altText || product.title,
            src: image?.src || "/placeholder.jpg",
          },
        ],
      },
      variant: {
        variantId: merchandise.id,
        variantTitle: merchandise.title,
        variantPrice: merchandise.price.amount,
        variantCurrencyCode: merchandise.price.currencyCode,
      },
    };
  };

  const handleAddToCart = async (
    e: React.FormEvent<HTMLFormElement> | undefined = undefined
  ) => {
    e?.preventDefault();

    if (!selectedVariant) {
      setShowSizeRequired(true);
      return;
    }

    setShowSizeRequired(false);

    // Get the quantity from the form or default to 1
    const quantity = e?.currentTarget?.quantity
      ? parseInt(e.currentTarget.quantity.value, 10)
      : 1;

    // Ensure the variantId is in GID format
    let variantId = selectedVariant.variantId;
    if (!variantId.startsWith("gid://")) {
      variantId = `gid://shopify/ProductVariant/${selectedVariant.variantId}`;
    }

    const lineItems = [{ variantId, quantity }];

    try {
      if (!state.cartId) {
        // No cart exists, create a new cart
        const response = await fetch("/api/createCart", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ lineItems }),
        });

        const data = await response.json();

        if (response.ok && data.cart) {
          // Update state with new cartId and cartItems
          setState({
            ...state,
            cartId: data.cart.id,
            cartItems: data.cart.lines.edges.map(mapCartLine),
            cartCost: data.cart.cost,
            checkoutUrl: data.cart.checkoutUrl,
            cartOpen: true,
          });
          toast.success("Added to cart");
        } else {
          console.error("Failed to create cart:", data);
          toast.error("Failed to create cart");
        }
      } else {
        // Cart exists, add items to the cart
        const response = await fetch("/api/addCartLines", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ cartId: state.cartId, lineItems }),
        });

        const data = await response.json();

        if (response.ok && data.cart) {
          // Update state with updated cartItems
          setState({
            ...state,
            cartItems: data.cart.lines.edges.map(mapCartLine),
            cartCost: data.cart.cost,
            cartOpen: true,
          });
          toast.success("Added to cart");
        } else {
          console.error("Failed to add items to cart:", data);
          toast.error("Failed to add items to cart");
        }
      }

      // Close the drawer or modal if necessary
      if (closeBox) {
        closeBox((prev: boolean) => !prev);
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("An error occurred while adding to cart");
    }
  };

  return (
    <div className="w-full">
      {showSizeRequired && (
        <p className="text-red-500 dark:text-red-400 text-sm mb-2 text-center">
          Please select a size
        </p>
      )}
      <form onSubmit={handleAddToCart} className="flex w-full gap-4">
        <select
          id="quantity"
          name="quantity"
          autoComplete="off"
          className="block w-fit px-6 pr-10 py-2 text-base border-gray-300 dark:border-gray-700 
          dark:bg-transparent dark:text-white focus:outline-none focus:ring-cypress-green 
          focus:border-cypress-green dark:focus:ring-cypress-green-light 
          dark:focus:border-cypress-green-light sm:text-sm"
          defaultValue="1">
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
        </select>

        <button
          type="submit"
          className={`flex w-full items-center justify-center border border-transparent 
          ${
            showSizeRequired
              ? "bg-gray-400 dark:bg-gray-700"
              : "bg-black hover:bg-gray-900 dark:hover:bg-gray-800 dark:hover:text-white dark:border-gray-800 border-2"
          } px-6 py-2 text-base font-medium text-white 
          focus:outline-none focus:ring-2 
          focus:ring-cypress-green dark:focus:ring-cypress-green-light focus:ring-offset-2 
          dark:focus:ring-offset-black transition-colors duration-200`}>
          Add to cart
        </button>
      </form>
    </div>
  );
};

export default AddToCartButton;
