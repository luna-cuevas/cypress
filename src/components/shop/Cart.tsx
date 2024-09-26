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
import { trajanLight, trajanRegular } from "@/lib/fonts";
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
    if (state.cartId != "") {
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
      setState({
        ...state,
        cartItems: data.cart.lines.edges.map(mapCartLine),
        cartCost: data.cart.cost,
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
        onClose={() =>
          setState({
            ...state,
            cartOpen: false,
          })
        }>
        <TransitionChild
          enter="ease-in-out duration-500"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in-out duration-500"
          leaveFrom="opacity-100"
          leaveTo="opacity-0">
          <div className="fixed inset-0 bg-gray-500 dark:bg-gray-800 !bg-opacity-75 transition-opacity" />
        </TransitionChild>

        <div className="fixed inset-0 overflow-hidden ">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none z-[10000000] fixed inset-y-0 right-0 flex max-w-full pl-10">
              <TransitionChild
                enter="transform transition ease-in-out duration-500 sm:duration-700"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500 sm:duration-700"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full">
                <DialogPanel className="pointer-events-auto w-screen max-w-lg">
                  <div className="flex h-full flex-col overflow-y-scroll dark:bg-gray-900 bg-white shadow-xl">
                    <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
                      <div className="flex items-start justify-between">
                        <DialogTitle
                          className={`${trajanRegular.className} text-lg font-medium text-gray-900 dark:text-white`}>
                          Shopping cart
                        </DialogTitle>
                        <div className="ml-3 flex h-7 items-center">
                          <button
                            type="button"
                            className="relative -m-2 p-2 text-gray-400 dark:text-white hover:text-gray-500"
                            onClick={() =>
                              setState({
                                ...state,
                                cartOpen: false,
                              })
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
                              className="-my-6 divide-y divide-gray-200">
                              {state.cartItems.map((item: Product) => {
                                const { product, variant, quantity, lineId } =
                                  item;
                                return (
                                  <li key={lineId} className="flex py-6">
                                    <Link href={`/shop/${product.handle}`}>
                                      {product.images[0]?.src ? (
                                        <div className="h-24 w-24 relative flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                                          <Image
                                            priority
                                            fill
                                            sizes="(max-width: 640px) 100vw,(max-width: 1024px) 50vw,33vw"
                                            blurDataURL="data:image/png;base64,..."
                                            placeholder="blur"
                                            src={product.images[0].src}
                                            alt={product.images[0].altText}
                                            className="h-full w-full object-cover object-center"
                                          />
                                        </div>
                                      ) : (
                                        <div className="h-full w-full bg-gray-200 flex items-center justify-center">
                                          <span className="text-gray-500">
                                            No Image Available
                                          </span>
                                        </div>
                                      )}
                                    </Link>

                                    <div className="ml-4 flex flex-1 flex-col">
                                      <div>
                                        <div className="flex justify-between text-base font-medium text-gray-900 dark:text-white">
                                          <h3>
                                            <Link
                                              className={`hover:text-cypress-green ${trajanRegular.className}`}
                                              href={`/shop/${product.handle}`}>
                                              {product.title}
                                            </Link>
                                          </h3>
                                          <p className="ml-4 font-bold">
                                            $
                                            {parseFloat(
                                              variant.variantPrice
                                            ).toFixed(2)}
                                          </p>
                                        </div>
                                        <p className="mt-1 text-sm text-gray-500 dark:text-white">
                                          {variant.variantTitle}
                                        </p>
                                      </div>
                                      <div className="flex flex-1 items-end justify-between text-sm">
                                        <div className="flex items-center">
                                          <button
                                            onClick={() =>
                                              updateCartLineQuantity(
                                                lineId,
                                                quantity - 1
                                              )
                                            }
                                            className="px-2">
                                            -
                                          </button>
                                          <p className="w-12 text-center outline-none border-none">
                                            {quantity}
                                          </p>
                                          <button
                                            onClick={() =>
                                              updateCartLineQuantity(
                                                lineId,
                                                quantity + 1
                                              )
                                            }
                                            className="px-2">
                                            +
                                          </button>
                                        </div>

                                        <div className="flex">
                                          <button
                                            type="button"
                                            onClick={() =>
                                              removeFromCart(lineId)
                                            }
                                            className={`font-bold ${trajanRegular.className} text-cypress-green hover:text-cypress-green-light`}>
                                            Remove
                                          </button>
                                        </div>
                                      </div>
                                    </div>
                                  </li>
                                );
                              })}
                            </ul>
                          ) : (
                            <div className="flex-1 mt-10 my-auto flex flex-col items-center justify-center">
                              <h2
                                className={`${trajanRegular.className} text-2xl font-bold text-gray-900 dark:text-white`}>
                                Your cart is empty
                              </h2>
                              <p
                                className={`${trajanLight.className} text-center text-lg text-gray-600 dark:text-white`}>
                                Looks like you haven't added any items to your
                                cart yet.
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {state.cartItems.length > 0 && (
                      <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
                        <div className="flex justify-between text-base font-bold text-gray-900">
                          <p>Subtotal</p>
                          <p>
                            $
                            {parseFloat(
                              state.cartCost.subtotalAmount.amount
                            ).toFixed(2)}
                          </p>
                        </div>
                        <p className="mt-0.5 text-sm text-gray-500 dark:text-white">
                          Shipping and taxes calculated at checkout.
                        </p>
                        <div className="mt-6 w-full">
                          <button
                            type="button"
                            onClick={createCheckout}
                            className="flex items-center w-full justify-center rounded-md border border-transparent bg-cypress-green px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-cypress-green-light">
                            Checkout
                          </button>
                        </div>
                        <div className="mt-6 flex justify-center text-center text-sm text-gray-500 dark:text-white">
                          <p>
                            or{" "}
                            <button
                              type="button"
                              className="font-bold text-cypress-green hover:text-cypress-green-light"
                              onClick={() =>
                                setState({
                                  ...state,
                                  cartOpen: false,
                                })
                              }>
                              Continue Shopping
                              <span aria-hidden="true"> &rarr;</span>
                            </button>
                          </p>
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
