"use client";
import { useEffect } from "react";
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useAtom } from "jotai";
import { globalStateAtom } from "@/context/atoms";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

type Product = {
  lineId: string;
  quantity: number;
  product: {
    id: string;
    handle: string;
    title: string;
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
        images: [
          {
            altText: image?.altText || "",
            src: image?.url || "",
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
    const response = await fetch("/api/fetchCart", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ cartId }),
    });

    const responseData = await response.json();

    if (responseData.cart) {
      setState({
        ...state,
        cartId: responseData.cart.id,
        cartItems: responseData.cart.lines.edges.map(mapCartLine),
        cartCost: responseData.cart.cost,
        checkoutUrl: responseData.cart.checkoutUrl,
      });
    } else {
      console.error("Failed to fetch cart:", responseData);
      // Handle cart not found
    }
  };

  // Fetch the cart when the component mounts
  useEffect(() => {
    if (state.cartId) {
      fetchCart(state.cartId);
    }
  }, [state.cartId]);

  // Function to update cart line quantity
  const updateCartLineQuantity = async (lineId: string, quantity: number) => {
    if (quantity < 1) {
      await removeFromCart(lineId);
      return;
    }

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

    if (response.ok && data.cart) {
      setState({
        ...state,
        cartItems: data.cart.lines.edges.map(mapCartLine),
        cartCost: data.cart.cost,
      });
    } else {
      console.error("Failed to update cart line:", data);
    }
  };

  // Function to remove item from cart
  const removeFromCart = async (lineId: string) => {
    const response = await fetch("/api/removeCartLines", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ cartId: state.cartId, lineIds: [lineId] }),
    });

    const data = await response.json();

    if (response.ok && data.cart) {
      const updatedCartItems = data.cart.lines.edges.map(mapCartLine);

      setState({
        ...state,
        cartItems: data.cart.lines.edges.map(mapCartLine),
        cartCost: data.cart.cost,
        cartId: updatedCartItems.length === 0 ? null : state.cartId,
      });
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

  return (
    <Transition show={state.cartOpen}>
      <Dialog
        className="relative !z-[200000000] cart"
        onClose={() => setState({ ...state, cartOpen: false })}>
        <TransitionChild
          enter="ease-in-out duration-500"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in-out duration-500"
          leaveFrom="opacity-100"
          leaveTo="opacity-0">
          <div className="fixed inset-0 bg-gray-500 dark:bg-gray-800 !bg-opacity-75 transition-opacity" />
        </TransitionChild>

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none z-[10000000] fixed inset-y-0 right-0 flex max-w-full pl-10">
              <TransitionChild
                enter="transform transition ease-in-out duration-500 sm:duration-700"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500 sm:duration-700"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full">
                <DialogPanel className="pointer-events-auto w-screen max-w-md">
                  <div className="flex flex-col h-full flex- px-0 overflow-y-scroll bg-white dark:bg-black shadow-xl">
                    <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-4">
                      <div className="flex items-start justify-between border-b">
                        <DialogTitle className="text-xl font-medium text-gray-900 dark:text-white !font-['trajan']">
                          Shopping cart
                        </DialogTitle>
                        <div className="ml-3 flex h-7 items-center">
                          <button
                            type="button"
                            className="relative -m-2 p-2 text-gray-400 hover:text-gray-500 dark:text-white dark:hover:text-gray-300 transition-all duration-200 focus:outline-none"
                            onClick={() =>
                              setState({ ...state, cartOpen: false })
                            }>
                            <span className="absolute -inset-0.5" />
                            <span className="sr-only">Close panel</span>
                            <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                          </button>
                        </div>
                      </div>

                      <div className="mt-8">
                        <div className="flow-root">
                          {state.cartItems.length > 0 ? (
                            <ul
                              role="list"
                              className="-my-6 divide-y divide-gray-200 dark:divide-gray-700">
                              {state.cartItems.map((item: Product) => {
                                const { product, variant, quantity, lineId } =
                                  item;
                                return (
                                  <li key={lineId} className="flex py-6">
                                    <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200 dark:border-gray-700">
                                      <Link href={`/shop/${product.handle}`}>
                                        <div className="relative h-full w-full">
                                          <Image
                                            priority
                                            fill
                                            sizes="96px"
                                            src={
                                              product.images[0]?.src ||
                                              "/placeholder.jpg"
                                            }
                                            alt={
                                              product.images[0]?.altText ||
                                              product.title
                                            }
                                            className="h-full w-full object-cover object-center"
                                          />
                                        </div>
                                      </Link>
                                    </div>

                                    <div className="ml-4 flex flex-1 flex-col">
                                      <div>
                                        <div className="flex justify-between">
                                          <h3 className="text-base font-medium text-gray-900 dark:text-white">
                                            <Link
                                              href={`/shop/${product.handle}`}
                                              className="!font-['trajan'] hover:text-cypress-green dark:hover:text-cypress-green-light transition-all duration-200">
                                              {product.title}
                                            </Link>
                                          </h3>
                                          <p className="ml-4 text-base font-medium text-gray-900 dark:text-white">
                                            $
                                            {parseFloat(
                                              variant.variantPrice
                                            ).toFixed(2)}
                                          </p>
                                        </div>
                                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                          {variant.variantTitle}
                                        </p>
                                      </div>

                                      <div className="flex flex-1 items-end justify-between text-sm">
                                        <div className="flex items-center border border-gray-200 dark:border-gray-700 rounded-md">
                                          <button
                                            onClick={() =>
                                              updateCartLineQuantity(
                                                lineId,
                                                quantity - 1
                                              )
                                            }
                                            className="px-3 py-1 text-gray-600 dark:text-gray-400 hover:text-cypress-green dark:hover:text-cypress-green-light transition-all duration-200 focus:outline-none">
                                            -
                                          </button>
                                          <span className="px-3 py-1 text-gray-900 dark:text-white border-x border-gray-200 dark:border-gray-700">
                                            {quantity}
                                          </span>
                                          <button
                                            onClick={() =>
                                              updateCartLineQuantity(
                                                lineId,
                                                quantity + 1
                                              )
                                            }
                                            className="px-3 py-1 text-gray-600 dark:text-gray-400 hover:text-cypress-green dark:hover:text-cypress-green-light">
                                            +
                                          </button>
                                        </div>

                                        <button
                                          type="button"
                                          onClick={() => removeFromCart(lineId)}
                                          className="font-medium text-red-500 hover:text-red-600 transition-all duration-200 focus:outline-none">
                                          Remove
                                        </button>
                                      </div>
                                    </div>
                                  </li>
                                );
                              })}
                            </ul>
                          ) : (
                            <div className="flex flex-col items-center justify-center py-12">
                              <h2 className="!font-['trajan'] text-xl font-medium text-gray-900 dark:text-white">
                                Your cart is empty
                              </h2>
                              <p className="mt-2 text-center text-gray-500 dark:text-gray-400">
                                Looks like you have not added any items to your
                                cart yet.
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {state.cartItems.length > 0 && (
                      <div className="border-t border-gray-200 dark:border-gray-700 px-4 py-6 sm:px-6">
                        <div className="flex justify-between text-base font-medium text-gray-900 dark:text-white">
                          <p>Subtotal</p>
                          <p>
                            $
                            {parseFloat(
                              state.cartCost.subtotalAmount.amount
                            ).toFixed(2)}
                          </p>
                        </div>
                        <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">
                          Shipping and taxes calculated at checkout.
                        </p>
                        <div className="mt-6">
                          <button
                            type="button"
                            onClick={createCheckout}
                            className="w-full rounded-md bg-cypress-green px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-cypress-green-light transition-all duration-200 focus:outline-none backdrop-blur-sm">
                            Checkout
                          </button>
                        </div>
                        <div className="mt-6 flex justify-center text-center text-sm text-gray-500 dark:text-gray-400">
                          <button
                            type="button"
                            className="font-medium text-cypress-green hover:text-cypress-green-light transition-all duration-200 focus:outline-none"
                            onClick={() =>
                              setState({ ...state, cartOpen: false })
                            }>
                            Continue Shopping
                            <span aria-hidden="true"> →</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </DialogPanel>
              </TransitionChild>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
