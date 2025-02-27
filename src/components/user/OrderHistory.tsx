"use client";
import React, { useEffect, useState } from "react";
import { Typography } from "@material-tailwind/react";
import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import { useSupabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";
import { Motion } from "@/utils/Motion";
import { ChevronRightIcon } from "@heroicons/react/24/outline";

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
      return "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400";
    case "pending":
      return "bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400";
    case "fulfilled":
      return "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400";
    case "unfulfilled":
      return "bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400";
    case "refunded":
      return "bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400";
    default:
      return "bg-gray-50 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400";
  }
};

export default function OrderHistory() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const supabase = useSupabase();

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return;

      try {
        const { data: orders, error } = await supabase
          .from("orders")
          .select<"orders", Order>(
            `
            *,
            order_items (*)
          `
          )
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        if (error) throw error;
        setOrders(orders || []);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

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
    <div className="space-y-10 py-2">
      {orders.map((order, index) => (
        <Motion
          key={order.id}
          type="div"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          className="border-b border-gray-100 dark:border-gray-800 pb-10 last:border-b-0 last:pb-0">
          <div className="flex flex-col space-y-6">
            {/* Order Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start space-y-4 sm:space-y-0">
              <div>
                <h3 className="text-lg md:text-xl font-light tracking-wide text-gray-900 dark:text-white mb-1">
                  #{order.order_number}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {format(new Date(order.created_at), "MMMM d, yyyy")}
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
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
            </div>

            {/* Order Items */}
            <div className="grid gap-6 sm:gap-8">
              {order.order_items?.map((item: OrderItem) => (
                <div key={item.id} className="flex gap-5 py-2">
                  {item.image_url && (
                    <div className="relative h-24 w-20 lg:h-32 lg:w-28 flex-shrink-0 overflow-hidden rounded-md bg-gray-50 dark:bg-gray-900">
                      <Image
                        src={item.image_url}
                        alt={item.image_alt || item.title}
                        fill
                        className="object-cover object-center"
                        sizes="(max-width: 768px) 80px, 112px"
                      />
                    </div>
                  )}
                  <div className="flex flex-col justify-between flex-grow">
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white text-sm sm:text-base">
                        {item.title}
                      </h4>
                      {item.variant_title && (
                        <p className="text-xs sm:text-sm text-gray-500 mt-1">
                          {item.variant_title}
                        </p>
                      )}
                    </div>
                    <div className="flex justify-between items-end mt-2">
                      <p className="text-xs sm:text-sm text-gray-500">
                        Qty: {item.quantity}
                      </p>
                      <p className="font-light text-sm sm:text-base text-gray-900 dark:text-white">
                        ${Number(item.price).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Footer */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pt-4 gap-4">
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {order.shipping_address && (
                  <p className="text-xs sm:text-sm">
                    Shipped to: {order.shipping_address.city},{" "}
                    {order.shipping_address.province_code}
                  </p>
                )}
              </div>

              <div className="flex justify-between w-full sm:w-auto">
                <p className="text-base font-medium text-gray-900 dark:text-white sm:mr-8">
                  Total:{" "}
                  <span className="font-light">
                    ${Number(order.total_price).toFixed(2)}
                  </span>
                </p>

                {order.status_url && (
                  <Link
                    href={order.status_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center text-sm font-medium text-cypress-green hover:text-cypress-green-light transition-colors duration-200">
                    <span>Track Order</span>
                    <ChevronRightIcon className="ml-1 w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-200" />
                  </Link>
                )}
              </div>
            </div>
          </div>
        </Motion>
      ))}
    </div>
  );
}
