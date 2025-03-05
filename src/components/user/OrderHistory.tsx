"use client";
import React, { useEffect, useState } from "react";
import { Typography } from "@material-tailwind/react";
import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import { useAuth } from "@/context/AuthContext";
import { Motion } from "@/utils/Motion";
import {
  ChevronRightIcon,
  ArrowUpRightIcon,
} from "@heroicons/react/24/outline";

type OrderItem = {
  id: string;
  title: string;
  variant_title: string;
  quantity: number;
  price: number;
  currency_code: string;
  image_url: string;
  image_alt: string;
};

type Order = {
  id: string;
  shopify_order_id: string;
  user_id: string;
  created_at: string;
  order_number: string;
  processed_at: string;
  financial_status: string;
  fulfillment_status: string;
  total_price: number;
  currency_code: string;
  shipping_address: {
    address1: string;
    address2?: string;
    city: string;
    province_code: string;
    zip: string;
    country: string;
  };
  status_url: string;
  order_items: OrderItem[];
};

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "paid":
      return "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/30";
    case "pending":
      return "bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400 border border-amber-200 dark:border-amber-800/30";
    case "fulfilled":
      return "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/30";
    case "unfulfilled":
      return "bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400 border border-amber-200 dark:border-amber-800/30";
    case "refunded":
      return "bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400 border border-red-200 dark:border-red-800/30";
    default:
      return "bg-gray-50 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400 border border-gray-200 dark:border-gray-800/30";
  }
};

const formatPrice = (amount: number, currencyCode = "USD") => {
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currencyCode,
    minimumFractionDigits: 2,
  });
  return formatter.format(amount);
};

export default function OrderHistory() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return;

      try {
        const response = await fetch(
          `/api/account/get-order-history?userId=${user.id}`
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to fetch orders");
        }

        const data = await response.json();
        setOrders(data.orders || []);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  const toggleOrderDetails = (orderId: string) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  // Show thumbnails for up to 3 products
  const renderOrderThumbnails = (orderItems: OrderItem[]) => {
    const itemsToShow = orderItems.slice(0, 3);
    const remainingCount = orderItems.length > 3 ? orderItems.length - 3 : 0;

    console.log("itemsToShow", itemsToShow);
    console.log("remainingCount", remainingCount);

    return (
      <div className="flex -space-x-3">
        {itemsToShow.map((item, index) =>
          item.image_url ? (
            <div
              key={item.id}
              className="relative h-10 w-10 md:h-12 md:w-12 rounded-full overflow-hidden border border-white dark:border-gray-800 bg-gray-50 dark:bg-gray-900 shadow-sm"
              style={{ zIndex: 10 - index }}>
              <Image
                src={item.image_url}
                alt={item.image_alt || item.title}
                fill
                className="object-cover object-center w-full h-full"
                sizes="48px"
              />
            </div>
          ) : null
        )}
        {remainingCount > 0 && (
          <div
            className="relative h-10 w-10 md:h-12 md:w-12 rounded-full flex items-center justify-center bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs font-medium border border-white dark:border-gray-700 shadow-sm"
            style={{ zIndex: 7 }}>
            +{remainingCount}
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-cypress-green border-t-transparent"></div>
      </div>
    );
  }

  if (!orders.length) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-6">
        <div className="p-6 border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50 rounded-full mb-6">
          <svg
            className="w-12 h-12 text-gray-300 dark:text-gray-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
            />
          </svg>
        </div>
        <Typography
          variant="h6"
          className="mb-2 text-gray-900 dark:text-white font-light">
          No Orders Yet
        </Typography>
        <Typography className="text-gray-600 dark:text-gray-400 max-w-md mb-8">
          When you make a purchase, your order history will appear here for easy
          tracking and reference.
        </Typography>
        <Link
          href="/shop"
          className="group inline-flex items-center text-sm font-medium text-cypress-green hover:text-cypress-green-light transition-colors duration-200">
          <span>Explore our collection</span>
          <ChevronRightIcon className="ml-1 w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-200" />
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 py-2">
      <div className="mb-8">
        <h2 className="text-2xl font-light text-gray-900 dark:text-white tracking-wider  mb-1">
          My Orders
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          View and track your purchase history
        </p>
      </div>

      {orders.map((order, index) => (
        <Motion
          key={order.id}
          type="div"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          className="group rounded-lg border border-gray-100 dark:border-gray-800 overflow-hidden transition-all duration-300 hover:border-gray-200 dark:hover:border-gray-700">
          <div
            className="p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between cursor-pointer"
            onClick={() => toggleOrderDetails(order.id)}>
            {/* Order Product Thumbnails - New */}
            <div className="hidden md:flex items-center mr-6">
              {order.order_items &&
                order.order_items.length > 0 &&
                renderOrderThumbnails(order.order_items)}
            </div>

            <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-8 flex-grow">
              {/* Order Product Thumbnails - Mobile */}
              <div className="flex md:hidden items-center mb-4">
                {order.order_items &&
                  order.order_items.length > 0 &&
                  renderOrderThumbnails(order.order_items)}
              </div>

              <div>
                <p className="text-xs  tracking-wider text-gray-500 dark:text-gray-400 mb-1">
                  Order
                </p>
                <h3 className="text-base md:text-lg font-light text-gray-900 dark:text-white tracking-wide">
                  #{order.order_number}
                </h3>
              </div>

              <div>
                <p className="text-xs  tracking-wider text-gray-500 dark:text-gray-400 mb-1">
                  Date
                </p>
                <p className="text-sm text-gray-900 dark:text-white">
                  {format(new Date(order.created_at), "MMMM d, yyyy")}
                </p>
              </div>

              <div>
                <p className="text-xs  tracking-wider text-gray-500 dark:text-gray-400 mb-1">
                  Total
                </p>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {formatPrice(order.total_price, order.currency_code)}
                </p>
              </div>
            </div>

            <div className="flex items-center mt-4 md:mt-0">
              <div className="flex flex-wrap gap-2 mr-4">
                <span
                  className={`text-xs font-medium px-3 py-1 rounded-full ${getStatusColor(
                    order.financial_status
                  )} capitalize`}>
                  {order.financial_status}
                </span>
                <span
                  className={`text-xs font-medium px-3 py-1 rounded-full ${getStatusColor(
                    order.fulfillment_status
                  )} capitalize`}>
                  {order.fulfillment_status}
                </span>
              </div>

              <div className="w-6 h-6 flex items-center justify-center transition-transform duration-300 transform group-hover:rotate-180">
                <svg
                  className="w-4 h-4 text-gray-500 dark:text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  style={{
                    transform:
                      expandedOrder === order.id
                        ? "rotate(180deg)"
                        : "rotate(0deg)",
                    transition: "transform 0.3s ease",
                  }}>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>
          </div>

          {expandedOrder === order.id && (
            <div className="border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/20 p-6 sm:p-8 transition-all duration-300">
              <div className="space-y-6">
                <h4 className="text-xs  tracking-wider text-gray-500 dark:text-gray-400 mb-4">
                  Items
                </h4>
                <div className="grid gap-6">
                  {order.order_items?.map((item: OrderItem) => (
                    <div key={item.id} className="flex gap-5 py-2">
                      {item.image_url && (
                        <div className="relative h-28 w-24 md:h-36 md:w-28  overflow-hidden bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800">
                          <Image
                            src={item.image_url}
                            alt={item.image_alt || item.title}
                            fill
                            className="object-cover object-center w-full h-full"
                            sizes="(max-width: 768px) 88px, 112px"
                          />
                        </div>
                      )}
                      <div className="flex flex-col justify-between flex-grow">
                        <div>
                          <h4 className="font-light text-gray-900 dark:text-white text-sm sm:text-base">
                            {item.title}
                          </h4>
                          {item.variant_title && (
                            <p className="text-xs sm:text-sm text-gray-500 mt-2">
                              {item.variant_title}
                            </p>
                          )}
                          <p className="text-xs sm:text-sm text-gray-500 mt-2">
                            Quantity: {item.quantity}
                          </p>
                        </div>
                        <p className="font-light text-sm sm:text-base text-gray-900 dark:text-white mt-4">
                          {formatPrice(item.price, item.currency_code)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h4 className="text-xs  tracking-wider text-gray-500 dark:text-gray-400 mb-4">
                    Shipping Information
                  </h4>
                  {order.shipping_address ? (
                    <div className="text-sm text-gray-900 dark:text-white space-y-1">
                      <p>{order.shipping_address.address1}</p>
                      {order.shipping_address.address2 && (
                        <p>{order.shipping_address.address2}</p>
                      )}
                      <p>
                        {order.shipping_address.city},{" "}
                        {order.shipping_address.province_code}{" "}
                        {order.shipping_address.zip}
                      </p>
                      <p>{order.shipping_address.country}</p>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">
                      No shipping information available
                    </p>
                  )}
                </div>

                <div>
                  <h4 className="text-xs  tracking-wider text-gray-500 dark:text-gray-400 mb-4">
                    Order Summary
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between items-center">
                      <p className="text-gray-600 dark:text-gray-400">
                        Order Date
                      </p>
                      <p className="text-gray-900 dark:text-white">
                        {format(new Date(order.created_at), "MMMM d, yyyy")}
                      </p>
                    </div>
                    <div className="flex justify-between items-center">
                      <p className="text-gray-600 dark:text-gray-400">
                        Order Status
                      </p>
                      <p className="text-gray-900 dark:text-white capitalize">
                        {order.financial_status}
                      </p>
                    </div>
                    <div className="flex justify-between items-center">
                      <p className="text-gray-600 dark:text-gray-400">
                        Fulfillment Status
                      </p>
                      <p className="text-gray-900 dark:text-white capitalize">
                        {order.fulfillment_status}
                      </p>
                    </div>
                    <div className="pt-3 mt-3 border-t border-gray-100 dark:border-gray-800 flex justify-between items-center font-medium">
                      <p className="text-gray-900 dark:text-white">Total</p>
                      <p className="text-gray-900 dark:text-white">
                        {formatPrice(order.total_price, order.currency_code)}
                      </p>
                    </div>
                  </div>

                  {order.status_url && (
                    <div className="mt-6">
                      <Link
                        href={order.status_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center py-2.5 px-4 border border-black dark:border-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black text-xs tracking-wider  font-light transition-all duration-300 focus:outline-none">
                        <span>Track Order</span>
                        <ArrowUpRightIcon className="ml-2 w-3.5 h-3.5" />
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </Motion>
      ))}
    </div>
  );
}
