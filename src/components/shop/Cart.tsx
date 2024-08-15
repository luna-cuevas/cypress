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
import { useAtom } from "jotai";
import { globalStateAtom } from "@/context/atoms";
import Image from "next/image";
import Link from "next/link";
import { trajanLight, trajanRegular } from "@/lib/fonts";

type Product = {
  quantity: number;
  product: {
    id: string;
    handle: string;
    title: string;
    description: string;
    images: Array<{
      altText: string;
      src: string;
    }>;
  };
  variant: {
    variantId: string;
    variantTitle: string;
    variantPrice: string;
    variantQuantityAvailable: number;
    variantCurrencyCode: string;
  };
};

export default function Cart() {
  const [state, setState] = useAtom(globalStateAtom);
  const [isLoaded, setIsLoaded] = useState(false);

  const createCheckout = async () => {
    const lineItems = state.cartItems.map((item: any) => ({
      variantId: item.variant.variantId,
      quantity: item.quantity,
    }));
    const checkout = await fetch("/api/createCheckout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        lineItems,
      }),
    }).then((res) => res.json());

    window.location.href = checkout.webUrl;
  };

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    isLoaded && (
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
                              <XMarkIcon
                                className="h-6 w-6"
                                aria-hidden="true"
                              />
                            </button>
                          </div>
                        </div>

                        <div className="mt-8">
                          <div className="flow-root">
                            {state.cartItems.length > 0 ? (
                              <ul
                                role="list"
                                className="-my-6 divide-y divide-gray-200">
                                {state.cartItems.map((productObj: Product) => {
                                  const { product, variant, quantity } =
                                    productObj;
                                  return (
                                    <li
                                      key={variant.variantId}
                                      className="flex py-6">
                                      <Link href={`/shop/${product.handle}`}>
                                        <div className="h-24 w-24 relative flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                                          <Image
                                            priority
                                            fill
                                            sizes="(max-width: 640px) 100vw,(max-width: 1024px) 50vw,33vw"
                                            blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mO8fPFiCwAH7wL7Pf/IOAAAAABJRU5ErkJggg=="
                                            placeholder="blur"
                                            src={product.images[0].src}
                                            alt={product.images[0].altText}
                                            className="h-full w-full object-cover object-center"
                                          />
                                        </div>
                                      </Link>

                                      <div className="ml-4 flex flex-1 flex-col">
                                        <div>
                                          <div className="flex justify-between text-base font-medium text-gray-900 dark:text-white">
                                            <h3>
                                              <Link
                                                className={`hover:text-cypress-green  ${trajanRegular.className}`}
                                                href={`/shop/${product.handle}`}>
                                                {product.title}
                                              </Link>
                                            </h3>
                                            <p className="ml-4 font-bold">
                                              ${variant.variantPrice}0
                                            </p>
                                          </div>
                                          <p className="mt-1 text-sm text-gray-500 dark:text-white">
                                            {variant.variantTitle}
                                          </p>
                                        </div>
                                        <div className="flex flex-1 items-end justify-between text-sm">
                                          <p className="text-gray-800">
                                            Qty {quantity}
                                          </p>

                                          <div className="flex">
                                            <button
                                              type="button"
                                              onClick={() => {
                                                // i want to remove the product from the cart
                                                const newCartItems =
                                                  state.cartItems.filter(
                                                    (item: Product) =>
                                                      item.variant.variantId !==
                                                      variant.variantId
                                                  );
                                                setState({
                                                  ...state,
                                                  cartItems: newCartItems,
                                                });
                                              }}
                                              className={`font-bold ${trajanRegular.className}  text-cypress-green hover:text-cypress-green-light`}>
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
                                  Looks like you haven&apos;t added any items to
                                  your cart yet.
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      <div
                        className={`border-t ${
                          state.cartItems.length > 0 ? "block" : "hidden"
                        } border-gray-200 px-4 py-6 sm:px-6`}>
                        <div className="flex justify-between text-base font-bold text-gray-900">
                          <p>Subtotal</p>
                          <p>
                            $
                            {state.cartItems.reduce(
                              (acc: number, item: Product) =>
                                acc +
                                parseFloat(item.variant.variantPrice) *
                                  item.quantity,
                              0
                            )}
                            .00
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
                              className="font-bold text-cypress-green hover:cypress-green-light"
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
                    </div>
                  </DialogPanel>
                </TransitionChild>
              </div>
            </div>
          </div>
        </Dialog>
      </Transition>
    )
  );
}
