"use client";
import React, { useEffect, useState } from "react";
import { Typography } from "@material-tailwind/react";
import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import { useSupabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";
import { Motion } from "@/utils/Motion";

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
      return "text-green-500";
    case "pending":
      return "text-yellow-500";
    case "fulfilled":
      return "text-green-500";
    case "unfulfilled":
      return "text-yellow-500";
    case "refunded":
      return "text-red-500";
    default:
      return "text-gray-500";
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
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-cypress-green"></div>
      </div>
    );
  }

  if (!orders.length) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[200px] text-center">
        <Typography variant="h6" className="mb-2 dark:text-white">
          No Orders Yet
        </Typography>
        <Typography className="text-gray-500">
          When you make a purchase, your orders will appear here.
        </Typography>
        <Link
          href="/shop"
          className="mt-4 text-cypress-green hover:text-cypress-green-light">
          Start Shopping →
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {orders.map((order, index) => (
        <Motion
          key={order.id}
          type="div"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          className="bg-white dark:bg-gray-900 border dark:border-gray-700 rounded-xl shadow-sm overflow-hidden">
          <div className="p-3">
            {/* Order Header */}
            <div className="flex flex-col lg:flex-row justify-between items-start mb-6 gap-4">
              <div className="flex flex-col lg:flex-row lg:items-center divide-y lg:divide-y-0 lg:divide-x divide-gray-200 dark:divide-gray-700 w-full lg:w-auto">
                {/* Order Number */}
                <div className="pb-4 lg:pb-0 lg:pr-4">
                  <h3 className="text-lg font-semibold dark:text-white">
                    Order #{order.order_number}
                  </h3>
                  <p className="text-sm text-gray-500">
                    Placed on{" "}
                    {format(new Date(order.created_at), "MMM d, yyyy")}
                  </p>
                </div>

                {/* Status Section */}
                <div className="py-4 lg:py-0 lg:px-4">
                  <h3 className="text-sm font-medium text-gray-500 mb-1">
                    Status
                  </h3>
                  <span
                    className={`text-xs font-medium px-2 py-1 rounded-full ${getStatusColor(
                      order.financial_status
                    )} bg-opacity-10 capitalize`}>
                    {order.financial_status}
                  </span>
                </div>

                {/* Fulfillment Section */}
                <div className="pt-4 lg:pt-0 lg:pl-4">
                  <h3 className="text-sm font-medium text-gray-500 mb-1">
                    Fulfillment
                  </h3>
                  <span
                    className={`text-xs font-medium px-2 py-1 rounded-full ${getStatusColor(
                      order.fulfillment_status
                    )} bg-opacity-10 capitalize`}>
                    {order.fulfillment_status}
                  </span>
                </div>
              </div>

              {/* Price */}
              <div className="lg:text-right border-t lg:border-t-0 pt-4 lg:pt-0 w-full lg:w-auto">
                <p className="text-lg font-semibold dark:text-white">
                  ${Number(order.total_price).toFixed(2)}
                </p>
              </div>
            </div>

            {/* Order Items */}
            <div className="space-y-4">
              {order.order_items?.map((item: OrderItem) => (
                <div
                  key={item.id}
                  className="flex gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  {item.image_url && (
                    <div className="relative w-20 h-20 flex-shrink-0">
                      <Image
                        src={item.image_url}
                        alt={item.image_alt || item.title}
                        fill
                        className="object-cover rounded-md"
                        sizes="80px"
                      />
                    </div>
                  )}
                  <div className="flex-grow">
                    <p className="font-medium dark:text-white">{item.title}</p>
                    {item.variant_title && (
                      <p className="text-sm text-gray-500 mt-1">
                        {item.variant_title}
                      </p>
                    )}
                    <div className="flex justify-between items-center mt-2">
                      <p className="text-sm text-gray-500">
                        Qty: {item.quantity}
                      </p>
                      <p className="font-medium dark:text-white">
                        ${Number(item.price).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Footer */}
            {order.status_url && (
              <div className="mt-6 pt-4 border-t dark:border-gray-700 flex justify-between items-center">
                <div className="text-sm text-gray-500">
                  {order.shipping_address && (
                    <p>
                      Shipping to: {order.shipping_address.city},{" "}
                      {order.shipping_address.province_code}
                    </p>
                  )}
                </div>
                <Link
                  href={order.status_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center font-bold gap-2 text-cypress-green hover:text-cypress-green-light">
                  <span>Track Order</span>
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    />
                  </svg>
                </Link>
              </div>
            )}
          </div>
        </Motion>
      ))}
    </div>
  );
}
