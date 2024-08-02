"use client";
import { globalStateAtom } from "@/context/atoms";
import { useAtom } from "jotai";
import React from "react";
import { toast } from "react-toastify";

type Props = {
  product: any;
  selectedVariant: any;
  closeBox?: any;
};

const AddToCartButton = (props: Props) => {
  const [state, setState] = useAtom(globalStateAtom);
  const { product, selectedVariant, closeBox } = props;

  const handleAddToCart = (
    e: React.FormEvent<HTMLFormElement> | undefined = undefined
  ) => {
    if (!selectedVariant) {
      console.error("Please select a variant");
      toast.error("Please select a variant");
      return;
    }

    // Check if the item with the exact variant already exists in the cart
    const existingItemIndex = state.cartItems.findIndex(
      (item: any) =>
        item.product.id === product.id &&
        item.variant.variantId === selectedVariant.variantId
    );

    if (existingItemIndex !== -1) {
      // The exact product variant exists, update its quantity
      const updatedCartItems = [...state.cartItems];
      updatedCartItems[existingItemIndex] = {
        ...updatedCartItems[existingItemIndex],
        quantity:
          Number(updatedCartItems[existingItemIndex].quantity) +
          Number(e?.currentTarget?.quantity?.value || 1),
      };

      setState({
        ...state,
        cartItems: updatedCartItems,
        cartOpen: true,
      });
    } else {
      // The exact product variant does not exist, add a new item
      setState({
        ...state,
        cartItems: [
          ...state.cartItems,
          {
            quantity: e?.currentTarget?.quantity?.value || 1,
            handle: product.handle,
            product: product,
            variant: selectedVariant,
          },
        ],
        cartOpen: true,
      });
    }
    closeBox((prev: boolean) => !prev);
    toast.success("Added to cart");
  };
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleAddToCart(e);
      }}
      className="flex w-full gap-4">
      <select
        id="quantity"
        name="quantity"
        autoComplete="quantity"
        className="block w-fit px-6 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-cypress-green focus:border-cypress-green sm:text-sm "
        defaultValue="1">
        <option value="1">1</option>
        <option value="2">2</option>
        <option value="3">3</option>
        <option value="4">4</option>
        <option value="5">5</option>
      </select>

      <button
        type="submit"
        className=" flex w-full items-center justify-center border border-transparent bg-cypress-green px-6 py-2 text-base font-medium text-white hover:bg-cypress-green-light focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
        Add to cart
      </button>
    </form>
  );
};

export default AddToCartButton;
