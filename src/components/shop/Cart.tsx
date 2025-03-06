"use client";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { PlusIcon, MinusIcon } from "@heroicons/react/24/outline";
import { useAtom } from "jotai";
import { globalStateAtom } from "@/context/atoms";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-toastify";

type Product = {
  lineId: string;
  quantity: number;
  product: {
    id: string;
    handle: string;
    title: string;
    vendor: string;
    images: Array<{
      altText: string;
      src: string;
    }>;
  };
  variant: {
    variantId: string;
    variantTitle: string;
    variantPrice: string;
    variantCurrencyCode: string;
  };
};

export default function Cart() {
  const [state, setState] = useAtom(globalStateAtom);
  const router = useRouter();
  const searchParams = useSearchParams();
  // Track inventory error messages for each cart line
  const [inventoryErrors, setInventoryErrors] = useState<{
    [lineId: string]: string;
  }>({});
  // Store timeout IDs to clear them when needed
  const [errorTimeouts, setErrorTimeouts] = useState<{
    [lineId: string]: NodeJS.Timeout;
  }>({});

  // Function to clear an inventory error after a delay
  const clearErrorAfterDelay = (lineId: string) => {
    // Clear any existing timeout for this lineId
    if (errorTimeouts[lineId]) {
      clearTimeout(errorTimeouts[lineId]);
    }

    // Set a new timeout
    const timeoutId = setTimeout(() => {
      setInventoryErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[lineId];
        return newErrors;
      });

      // Remove the timeout reference
      setErrorTimeouts((prev) => {
        const newTimeouts = { ...prev };
        delete newTimeouts[lineId];
        return newTimeouts;
      });
    }, 3000); // 3 seconds

    // Store the timeout ID
    setErrorTimeouts((prev) => ({
      ...prev,
      [lineId]: timeoutId,
    }));
  };

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      // Clear all timeouts when component unmounts
      Object.values(errorTimeouts).forEach((timeoutId) => {
        clearTimeout(timeoutId);
      });
    };
  }, [errorTimeouts]);

  // Function to map cart lines from Shopify to local state
  const mapCartLine = (edge: any): Product => {
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
        vendor: product.vendor || "Unknown",
        images: [
          {
            altText: image?.altText || product.title,
            src: image?.url || image?.src || "/placeholder.jpg",
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

  // Function to fetch the cart from Shopify
  const fetchCart = async (cartId: string) => {
    try {
      // Add a small delay to ensure cart creation is complete
      await new Promise((resolve) => setTimeout(resolve, 500));

      const response = await fetch("/api/fetchCart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ cartId }),
      });

      const responseData = await response.json();

      // Handle various response status codes
      if (response.ok) {
        if (responseData.cart) {
          setState((prevState) => ({
            // Use function form to avoid stale state
            ...prevState,
            cartId: responseData.cart.id,
            cartItems: responseData.cart.lines.edges.map(mapCartLine),
            cartCost: responseData.cart.cost,
            checkoutUrl: responseData.cart.checkoutUrl,
          }));
        } else {
          console.log("Cart response missing cart data:", responseData);
        }
      } else if (response.status === 404) {
        // Cart not found case (404)
        console.log("Cart not found:", responseData);

        if (responseData.status === "cart_not_found") {
          // Create a new cart or reset the cart state
          setState((prevState) => ({
            ...prevState,
            cartId: null,
            cartItems: [],
            cartCost: {
              subtotalAmount: { amount: "0", currencyCode: "USD" },
              totalAmount: { amount: "0", currencyCode: "USD" },
            },
          }));

          // Optionally, display a message to the user
          toast.info("Your cart has expired. Starting a new cart.");
        }
      } else {
        // Server error (500 or other)
        console.error("Server error fetching cart:", responseData);
        // Don't clear the cart on server errors, just notify the user
        toast.error("Trouble connecting to the shop. Please try again later.");
      }
    } catch (error) {
      console.error("Failed to fetch cart:", error);
      // Don't clear the cart on network errors either
      toast.error("Network error. Please check your connection.");
    }
  };

  // Fetch the cart when the component mounts
  useEffect(() => {
    if (state.cartId) {
      fetchCart(state.cartId);
    }
  }, [state.cartId]);

  // Debug log when cart items change
  useEffect(() => {}, [state.cartItems]);

  // Function to update cart line quantity
  const updateCartLineQuantity = async (lineId: string, quantity: number) => {
    if (quantity < 1) {
      await removeFromCart(lineId);
      return;
    }

    // Prepare the lines for the update
    const lines = [
      {
        id: lineId,
        quantity,
      },
    ];

    const response = await fetch("/api/updateCartLines", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ cartId: state.cartId, lines }),
    });

    const data = await response.json();

    // Check for user errors directly in the response
    if (data.userErrors && data.userErrors.length > 0) {
      // If the error is about cart not existing, don't clear the cart
      if (
        data.userErrors.some((error: { message?: string }) =>
          error.message?.includes("cart does not exist")
        )
      ) {
        console.error(
          "Cart ID mismatch detected. Will attempt to refresh cart with current ID."
        );
        toast.error("Unable to update cart. Refreshing cart data...");

        // If above failed or wasn't attempted, try with state.cartId
        if (state.cartId) {
          try {
            await fetchCart(state.cartId);

            // If still no items after this attempt, create a new cart
            if (!state.cartItems || state.cartItems.length === 0) {
              console.log("Cart recovery failed. Creating new cart.");
              toast.info("Your cart has expired. Starting a new cart.");
              setState((prevState) => ({
                ...prevState,
                cartId: null,
              }));
            }
          } catch (err) {
            console.error("Failed to recover with state cart ID:", err);
          }
        }

        return;
      }

      // Store inventory errors by lineId in state instead of showing toast
      const newErrors = { ...inventoryErrors };
      data.userErrors.forEach((error: { message: string }) => {
        newErrors[lineId] = error.message;
      });
      setInventoryErrors(newErrors);

      // Clear the error after 3 seconds
      clearErrorAfterDelay(lineId);
    } else {
      // Clear any errors for this line if successful
      if (inventoryErrors[lineId]) {
        const newErrors = { ...inventoryErrors };
        delete newErrors[lineId];
        setInventoryErrors(newErrors);

        // Clear any existing timeout
        if (errorTimeouts[lineId]) {
          clearTimeout(errorTimeouts[lineId]);
          setErrorTimeouts((prev) => {
            const newTimeouts = { ...prev };
            delete newTimeouts[lineId];
            return newTimeouts;
          });
        }
      }
    }

    if (data.cart) {
      // Make a copy of cartItems to ensure state update triggers a re-render
      const updatedCartItems = data.cart.lines.edges.map(mapCartLine);

      setState((prevState) => ({
        ...prevState,
        cartId: data.cart.id, // Make sure to update the cart ID
        cartItems: updatedCartItems,
        cartCost: data.cart.cost,
      }));
    } else if (
      !data.userErrors?.some((error: { message?: string }) =>
        error.message?.includes("cart does not exist")
      )
    ) {
      console.error("Failed to update cart line:", data);
    }
  };

  // Function to remove item from cart
  const removeFromCart = async (lineId: string) => {
    // Clear any inventory errors for this line when removing
    if (inventoryErrors[lineId]) {
      const newErrors = { ...inventoryErrors };
      delete newErrors[lineId];
      setInventoryErrors(newErrors);

      // Clear any existing timeout
      if (errorTimeouts[lineId]) {
        clearTimeout(errorTimeouts[lineId]);
        setErrorTimeouts((prev) => {
          const newTimeouts = { ...prev };
          delete newTimeouts[lineId];
          return newTimeouts;
        });
      }
    }

    let cartIdToUse = state.cartId;

    const response = await fetch("/api/removeCartLines", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ cartId: cartIdToUse, lineIds: [lineId] }),
    });

    const data = await response.json();

    if (response.ok && data.cart) {
      const updatedCartItems = data.cart.lines.edges.map(mapCartLine);

      // Use function form of setState to avoid stale state updates
      setState((prevState) => ({
        ...prevState,
        cartItems: data.cart.lines.edges.map(mapCartLine),
        cartCost: data.cart.cost,
        cartId: updatedCartItems.length === 0 ? null : data.cart.id, // Keep the full ID with key
      }));
    } else {
      console.error("Failed to remove item from cart:", data);
    }
  };

  // Function to proceed to checkout
  const createCheckout = () => {
    if (state.checkoutUrl) {
      setState({
        ...state,
        cartOpen: false,
      });

      router.push(state.checkoutUrl);
    } else {
      console.error("Checkout URL is missing");
    }
  };

  useEffect(() => {
    // Check for Shopify success parameter
    const checkoutStatus = searchParams.get("checkout_status");

    if (checkoutStatus === "success") {
      // Clear the cart
      setState({
        ...state,
        cartId: null,
        cartItems: [],
        cartCost: {
          subtotalAmount: {
            amount: 0,
            currencyCode: "USD",
          },
          totalTax: {
            amount: 0,
            currencyCode: "USD",
          },
          totalDuty: {
            amount: 0,
            currencyCode: "USD",
          },
          total: {
            amount: 0,
            currencyCode: "USD",
          },
        },
        checkoutUrl: null,
      });

      // Optional: Remove the query parameter from the URL
      const newUrl = window.location.pathname;
      window.history.replaceState({}, "", newUrl);
    }
  }, [searchParams, setState]);

  return (
    <Transition show={state.cartOpen} as="div" className="font-light ">
      <Dialog
        className="relative !z-[2000000000000] cart"
        onClose={() => setState({ ...state, cartOpen: false })}>
        <TransitionChild
          enter="ease-in-out duration-700"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in-out duration-700"
          leaveFrom="opacity-100"
          leaveTo="opacity-0">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity" />
        </TransitionChild>

        <div className="fixed inset-0 overflow-hidden">
          <div className="pointer-events-none z-[10000000] fixed inset-y-0 right-0 flex max-w-full pl-10 sm:pl-16">
            <TransitionChild
              enter="transform transition ease-in-out duration-700"
              enterFrom="translate-x-full"
              enterTo="translate-x-0"
              leave="transform transition ease-in-out duration-700"
              leaveFrom="translate-x-0"
              leaveTo="translate-x-full">
              <DialogPanel className="pointer-events-auto w-screen max-w-md">
                <div className="flex h-full flex-col bg-white dark:bg-gray-900 shadow-xl">
                  <div className="flex-1 overflow-y-auto py-0">
                    <div className="px-4 sm:px-6 py-8 sm:py-10">
                      <div className="flex items-start justify-between pb-6">
                        <DialogTitle className="text-xl sm:text-2xl font-extralight tracking-wide text-gray-900 dark:text-white ">
                          Your Selections
                        </DialogTitle>
                        <div className="ml-3 flex h-7 items-center">
                          <button
                            type="button"
                            className="relative -m-2 p-2 text-gray-400 hover:text-black dark:text-white dark:hover:text-white transition-all duration-300 focus:outline-none"
                            onClick={() =>
                              setState({ ...state, cartOpen: false })
                            }>
                            <span className="absolute -inset-0.5" />
                            <span className="sr-only">Close panel</span>
                            <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                          </button>
                        </div>
                      </div>

                      <div className="mt-6">
                        <div className="flow-root">
                          {state.cartItems.length > 0 ? (
                            <ul
                              role="list"
                              className="divide-y divide-gray-100 dark:divide-gray-800">
                              {state.cartItems.map((item: Product) => {
                                const { product, variant, quantity, lineId } =
                                  item;
                                return (
                                  <li
                                    key={lineId}
                                    className="flex py-6 sm:py-8">
                                    <div className="group h-24 w-24 sm:h-32 sm:w-32 flex-shrink-0 overflow-hidden rounded-none border-none relative">
                                      <Link href={`/shop/${product.handle}`}>
                                        <div className="relative h-full w-full overflow-hidden">
                                          <Image
                                            priority
                                            fill
                                            sizes="(max-width: 640px) 96px, 128px"
                                            src={
                                              product.images[0]?.src ||
                                              "/placeholder.jpg"
                                            }
                                            alt={
                                              product.images[0]?.altText ||
                                              product.title
                                            }
                                            className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-110"
                                          />
                                        </div>
                                      </Link>
                                    </div>

                                    <div className="ml-4 sm:ml-6 flex flex-1 flex-col">
                                      <div>
                                        <div className="flex justify-between items-start">
                                          <h3 className="text-sm font-light  tracking-wider text-gray-900 dark:text-white max-w-[160px] sm:max-w-[200px]">
                                            <Link
                                              href={`/shop/${product.handle}`}
                                              className="hover:text-cypress-green dark:hover:text-cypress-green-light transition-all duration-300 truncate block">
                                              {product.title}
                                            </Link>
                                          </h3>
                                          <p className="text-sm font-light text-gray-900 dark:text-white whitespace-nowrap">
                                            {variant.variantCurrencyCode ===
                                            "USD"
                                              ? "$"
                                              : variant.variantCurrencyCode}
                                            {parseFloat(
                                              variant.variantPrice
                                            ).toFixed(2)}
                                          </p>
                                        </div>
                                        <p className="mt-2 text-xs text-gray-500 dark:text-gray-400  tracking-widest truncate">
                                          {product.vendor}{" "}
                                          {variant.variantTitle !==
                                            "Default Title" && (
                                            <span>
                                              • {variant.variantTitle}
                                            </span>
                                          )}
                                        </p>
                                        {inventoryErrors[lineId] && (
                                          <p className="text-red-500 dark:text-red-400 text-xs mt-2 ">
                                            {inventoryErrors[lineId]}
                                          </p>
                                        )}
                                      </div>

                                      <div className="flex flex-1 items-end justify-between text-sm mt-6">
                                        <div className="flex flex-col">
                                          <div className="flex items-center border border-gray-200 dark:border-gray-700">
                                            <button
                                              onClick={() =>
                                                updateCartLineQuantity(
                                                  lineId,
                                                  quantity - 1
                                                )
                                              }
                                              className="px-2 sm:px-3 py-1 text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-all duration-300 focus:outline-none">
                                              <MinusIcon className="h-3 w-3" />
                                            </button>
                                            <span className="px-3 sm:px-4 py-1 text-xs text-gray-900 dark:text-white border-x border-gray-200 dark:border-gray-700">
                                              {quantity}
                                            </span>
                                            <button
                                              onClick={() =>
                                                updateCartLineQuantity(
                                                  lineId,
                                                  quantity + 1
                                                )
                                              }
                                              className="px-2 sm:px-3 py-1 text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-all duration-300">
                                              <PlusIcon className="h-3 w-3" />
                                            </button>
                                          </div>
                                        </div>

                                        <button
                                          type="button"
                                          onClick={() => removeFromCart(lineId)}
                                          className="text-xs  tracking-wide font-light text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white transition-all duration-300 focus:outline-none">
                                          Remove
                                        </button>
                                      </div>
                                    </div>
                                  </li>
                                );
                              })}
                            </ul>
                          ) : (
                            <div className="flex flex-col items-center justify-center py-20">
                              <h2 className="text-xl font-light text-gray-900 dark:text-white  tracking-widest">
                                Your cart is empty
                              </h2>
                              <p className="mt-4 text-center text-sm text-gray-500 dark:text-gray-400 max-w-xs">
                                We invite you to explore our curated collection
                                and discover pieces that resonate with your
                                personal style.
                              </p>
                              <button
                                type="button"
                                className="mt-8 text-sm font-light tracking-wide  text-cypress-green hover:text-cypress-green-light transition-all duration-300 focus:outline-none border-b border-transparent hover:border-cypress-green-light pb-1"
                                onClick={() => {
                                  setState({ ...state, cartOpen: false });
                                  router.push("/shop");
                                }}>
                                Explore Collection
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {state.cartItems.length > 0 && (
                    <div className="border-t border-gray-100 dark:border-gray-800 px-4 sm:px-6 py-6 sm:py-8">
                      <div className="flex justify-between text-sm font-light  tracking-widest text-gray-900 dark:text-white">
                        <p>Subtotal</p>
                        <p>
                          $
                          {parseFloat(
                            state.cartCost.subtotalAmount.amount
                          ).toFixed(2)}
                        </p>
                      </div>
                      <p className="mt-2 mb-6 text-xs text-gray-500 dark:text-gray-400">
                        Shipping and taxes calculated at checkout.
                      </p>

                      <div className="mt-6 space-y-4">
                        <button
                          type="button"
                          onClick={createCheckout}
                          className="w-full py-3 border text-black dark:text-white border-black dark:border-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-white text-sm font-light  tracking-widest transition-all duration-300 focus:outline-none">
                          Proceed to Checkout
                        </button>

                        <button
                          type="button"
                          className="w-full text-center text-sm font-light  tracking-widest text-gray-900 dark:text-white hover:text-cypress-green dark:hover:text-cypress-green-light transition-all duration-300 focus:outline-none"
                          onClick={() =>
                            setState({ ...state, cartOpen: false })
                          }>
                          Continue Shopping
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
