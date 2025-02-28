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
      let success = false;

      // Check if we have a cart ID
      if (state.cartId) {
        // Try to add to the existing cart
        success = await addToExistingCart(lineItems);
      }

      // If no cart ID or adding to existing cart failed, create a new cart
      if (!success) {
        console.log(
          "Creating new cart since adding to existing cart failed or no cart exists"
        );
        success = await createNewCart(lineItems);
      }

      if (success && closeBox) {
        // Close the drawer or modal if necessary
        closeBox((prev: boolean) => !prev);
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("An error occurred while adding to cart");
    }
  };

  // Function to add items to an existing cart
  const addToExistingCart = async (lineItems: any[]) => {
    // Don't strip query parameters - they're needed for Shopify
    // const cleanCartId = state.cartId ? state.cartId.split("?")[0] : null;
    const cartIdToUse = state.cartId;

    const response = await fetch("/api/addCartLines", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ cartId: cartIdToUse, lineItems }),
    });

    // Read the response data
    const data = await response.json();

    // Log the full response for debugging

    // Special check for the case where Shopify returns a 200 with both a new cart AND cart not found errors
    // This is an unusual edge case but appears to happen in the Shopify API
    const cartNotFoundError = data.userErrors?.some(
      (err: { message: string }) =>
        err.message.includes("does not exist") ||
        err.message.includes("cart does not exist")
    );

    if (cartNotFoundError) {
      // Even though we got a 200 status and maybe even a new cart,
      // we should treat this as a "cart not found" case and create a fresh cart
      console.log("Cart not found error detected despite 200 status");
      toast.info("Your previous cart has expired. Creating a new one.");

      // Clear the invalid cart ID
      console.log("Clearing cart ID due to cart not found error");
      setState((prev) => ({
        ...prev,
        cartId: null,
        cartItems: [],
        cartCost: {
          subtotalAmount: { amount: "0", currencyCode: "USD" },
          totalAmount: { amount: "0", currencyCode: "USD" },
        },
      }));

      return false;
    }

    // Normal success case - no user errors
    if (response.ok && data.cart && !data.userErrors?.length) {
      // Success - update state with updated cartItems

      setState({
        ...state,
        cartId: data.cart.id, // Keep the full ID with key
        cartItems: data.cart.lines.edges.map(mapCartLine),
        cartCost: data.cart.cost,
        cartOpen: true,
      });
      toast.success("Added to cart");
      return true;
    } else if (!response.ok || response.status === 404) {
      // API returned a non-200 status
      console.log("API error response when adding to cart:", response.status);
      toast.info("Your previous cart has expired. Creating a new one.");

      // Clear the invalid cart ID
      setState((prev) => ({
        ...prev,
        cartId: null,
        cartItems: [],
        cartCost: {
          subtotalAmount: { amount: "0", currencyCode: "USD" },
          totalAmount: { amount: "0", currencyCode: "USD" },
        },
      }));

      return false;
    } else if (response.ok && data.cart && data.userErrors?.length) {
      // Got a cart but there were other types of user errors (like inventory issues)
      console.log(
        "Cart operation had non-critical user errors:",
        data.userErrors
      );

      // Show the first error message to the user
      if (data.userErrors[0]?.message) {
        toast.error(data.userErrors[0].message);
      } else {
        toast.error("Could not add item to cart");
      }

      // Still update the cart ID and items (if any) but don't create a new cart
      if (data.cart.id) {
        setState({
          ...state,
          cartId: data.cart.id,
          cartItems: data.cart.lines.edges.map(mapCartLine),
          cartCost: data.cart.cost,
        });
      }

      // Return true because we don't need to create a new cart
      return true;
    } else {
      // Other error
      console.error("Failed to add items to cart:", data);
      toast.error("Failed to add items to cart");
      return false;
    }
  };

  // Function to create a new cart
  const createNewCart = async (lineItems: any[]) => {
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

      // Check for user errors that might have been returned
      if (data.userErrors && data.userErrors.length > 0) {
        console.log("Cart created with errors:", data.userErrors);

        // Show the first error message to the user
        if (data.userErrors[0]?.message) {
          toast.error(data.userErrors[0].message);
        }
      }

      setState({
        ...state,
        cartId: data.cart.id, // Keep the full ID with key for localStorage
        cartItems: data.cart.lines.edges.map(mapCartLine),
        cartCost: data.cart.cost,
        checkoutUrl: data.cart.checkoutUrl,
        cartOpen: true,
      });
      toast.success("Added to cart");
      return true;
    } else {
      console.error("Failed to create cart:", data);
      toast.error("Failed to create cart");
      return false;
    }
  };

  return (
    <div className="w-full">
      {showSizeRequired && (
        <p className="text-red-500 dark:text-red-400 text-xs uppercase tracking-wide mb-3 text-center font-light">
          Please select a size
        </p>
      )}
      <form onSubmit={handleAddToCart} className="flex w-full gap-3">
        <div className="relative">
          <select
            id="quantity"
            name="quantity"
            autoComplete="off"
            className="block w-12 text-center appearance-none bg-transparent border border-gray-200 hover:border-black 
            dark:border-gray-700 dark:hover:border-white transition-colors duration-200
            dark:bg-transparent dark:text-white focus:outline-none focus:border-black 
            dark:focus:border-white px-2 py-2.5 text-xs tracking-wide font-light pr-4"
            defaultValue="1">
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
          </select>
        </div>

        <button
          type="submit"
          className={`flex w-full items-center justify-center
          ${
            showSizeRequired
              ? "border-red-500 dark:border-red-400"
              : "border-black dark:border-white"
          } border py-2.5 text-xs tracking-wide font-light uppercase text-white bg-black hover:bg-gray-900 
          dark:bg-white dark:text-black dark:hover:bg-gray-100 
          focus:outline-none transition-colors duration-200`}>
          Add to cart
        </button>
      </form>
    </div>
  );
};

export default AddToCartButton;
